// ================= server.js =================
require('dotenv').config();

const express  = require("express");
const cors     = require("cors");
const sqlite3  = require("sqlite3").verbose();
const path     = require("path");
const Groq     = require("groq-sdk");

const app  = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ✅ UPDATED CSP (ONLY CHANGE — NOTHING ELSE TOUCHED)
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org https://*.openstreetmap.org; script-src 'self' 'unsafe-inline' https://unpkg.com; connect-src 'self' https://nominatim.openstreetmap.org; style-src 'self' 'unsafe-inline' https://unpkg.com; media-src 'self';"
    );
    next();
});

// ================= DATABASE =================
const db = new sqlite3.Database("./db.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    dosage TEXT,
    time TEXT,
    repeat TEXT,
    last_taken_date TEXT,
    enabled INTEGER DEFAULT 1
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS caretakers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    relation TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS sos_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    latitude REAL,
    longitude REAL,
    timestamp TEXT
)
`);

// ================= STATIC ROUTES =================
app.get("/medicines.html", (req, res) => {
    res.sendFile(path.join(__dirname, "medicine.html"));
});

// ================= APP ROUTES =================
require("./routes/remindersRoutes")(app, db);
require("./routes/medicinesRoutes")(app, db);
require("./routes/sosRoutes")(app, db);

// ================= VOICE REMINDER ROUTE (Groq LLM) =================
app.post("/api/voice-reminder", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: "No text provided" });

    console.log("🎤 Voice command received:", text);

    const today = new Date().toISOString().split("T")[0];
    const now   = new Date().toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const systemPrompt = `
You are a reminder parser. The user spoke a voice command.
Today's date is ${today}. Tomorrow's date is ${tomorrowStr}. Current time is ${now}.

Extract reminder details and return ONLY valid JSON — no markdown, no explanation, no extra text.
Return this exact shape:
{
  "reminders": [
    {
      "title": "short description of what to do",
      "time": "HH:MM in 24-hour format",
      "repeat": "none | daily | weekly",
      "date": "YYYY-MM-DD"
    }
  ]
}
`;

    try {
        const response = await groq.chat.completions.create({
            model:       "llama-3.3-70b-versatile",
            max_tokens:  300,
            temperature: 0,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user",   content: text }
            ]
        });

        const raw = response.choices[0].message.content.trim();
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed  = JSON.parse(cleaned);
        const reminders = parsed.reminders || [];

        if (reminders.length === 0) {
            return res.json({ success: false, reminder: null, allReminders: [] });
        }

        res.json({ success: true, reminder: reminders[0], allReminders: reminders });

    } catch (err) {
        console.error("❌ LLM parse error:", err.message);
        res.status(500).json({ success: false, error: "LLM failed", reminder: null });
    }
});

// ================= GENERAL LLM ROUTE (Groq) =================
app.post("/api/llm", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    try {
        const response = await groq.chat.completions.create({
            model:      "llama-3.3-70b-versatile",
            max_tokens: 500,
            messages:   [{ role: "user", content: prompt }]
        });

        const answer = response.choices[0].message.content;

        let action = "none";
        let data   = {};
        if (answer.toLowerCase().includes("medicine")) action = "medicine";
        if (answer.toLowerCase().includes("sos"))      action = "sos";

        res.json({ answer, action, data });

    } catch (err) {
        console.error("❌ LLM route error:", err.message);
        res.status(500).json({ answer: "LLM failed", action: "none", data: {} });
    }
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});