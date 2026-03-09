const express = require("express");
const cors = require("cors");
const chrono = require("chrono-node");
const cron = require("node-cron");
const admin = require("firebase-admin");

// Firebase setup
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());


// ================= ROOT TEST =================
app.get("/", (req, res) => {
  res.send("Sahaaya backend is running");
});


// ================= VOICE ASSISTANT API =================
app.post("/assistant", async (req, res) => {

  try {

    const command = req.body.command?.toLowerCase();

    if (!command) {
      return res.status(400).json({
        action: "error",
        message: "No command received"
      });
    }

    console.log("User command:", command);


    // ================= REMINDER =================
    if (command.includes("remind")) {

      const date = chrono.parseDate(command);

      if (!date) {
        return res.json({
          action: "reminder_error",
          message: "I could not understand the reminder time."
        });
      }

      const task = command
        .replace("remind me to", "")
        .replace(/at .*/, "")
        .trim();

      const reminder = {
        task: task,
        time: date,
        createdAt: new Date()
      };

      await db.collection("reminders").add(reminder);

      return res.json({
        action: "set_reminder",
        reminder: reminder,
        message: `Reminder set for ${task}`
      });
    }


    // ================= EMERGENCY =================
    if (command.includes("emergency") || command.includes("help")) {

      return res.json({
        action: "emergency",
        message: "Triggering emergency assistance"
      });

    }


    // ================= HOSPITAL SEARCH =================
    if (command.includes("hospital")) {

      return res.json({
        action: "find_services",
        service: "hospital",
        message: "Searching nearby hospitals"
      });

    }


    // ================= UNKNOWN =================
    return res.json({
      action: "unknown",
      message: "Sorry, I did not understand that command"
    });


  } catch (error) {

    console.error("Server error:", error);

    res.status(500).json({
      action: "error",
      message: "Server error occurred"
    });

  }

});


// ================= REMINDER CHECKER =================
cron.schedule("* * * * *", async () => {

  try {

    const now = new Date();

    const snapshot = await db.collection("reminders").get();

    snapshot.forEach(doc => {

      const reminder = doc.data();

      const reminderTime = new Date(reminder.time);

      const difference = Math.abs(reminderTime - now);

      if (difference < 60000) {

        console.log("Reminder Triggered:", reminder.task);

      }

    });

  } catch (error) {

    console.log("Cron error:", error);

  }

});


// ================= START SERVER =================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
