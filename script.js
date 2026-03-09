// ================= LANGUAGE DATA =================

const translations = {
    en: {
        heroTitle: "Care. Comfort. Dignity.",
        heroDesc: "Empowering senior citizens with safe, smart and compassionate care solutions.",
        servicesTitle: "Our Services",
        service1: "Home Nursing",
        service2: "Medicine Management",
        service3: "Smart Reminders",
        service4: "Health Records",
        service5: "Emergency Support",
        emergencyTitle: "Emergency First System",
        emergencyDesc: "One tap SOS. Instant caregiver and family alerts."
    },

    hi: {
        heroTitle: "देखभाल। आराम। सम्मान।",
        heroDesc: "वरिष्ठ नागरिकों को सुरक्षित और संवेदनशील देखभाल समाधान प्रदान करना।",
        servicesTitle: "हमारी सेवाएं",
        service1: "होम नर्सिंग",
        service2: "दवा प्रबंधन",
        service3: "स्मार्ट रिमाइंडर",
        service4: "स्वास्थ्य रिकॉर्ड",
        service5: "आपातकालीन सहायता",
        emergencyTitle: "आपातकालीन प्रणाली",
        emergencyDesc: "एक क्लिक में SOS। तुरंत परिवार को सूचना।"
    },

    ta: {
        heroTitle: "பாதுகாப்பு. நிம்மதி. மரியாதை.",
        heroDesc: "மூத்த குடிமக்களுக்கு பாதுகாப்பான மற்றும் அன்பான பராமரிப்பு.",
        servicesTitle: "எங்கள் சேவைகள்",
        service1: "வீட்டு செவிலியர்",
        service2: "மருந்து மேலாண்மை",
        service3: "நினைவூட்டல்கள்",
        service4: "மருத்துவ பதிவுகள்",
        service5: "அவசர உதவி",
        emergencyTitle: "அவசர அமைப்பு",
        emergencyDesc: "ஒரே அழுத்தத்தில் SOS. உடனடி அறிவிப்பு."
    },

    te: {
        heroTitle: "సంరక్షణ. సౌకర్యం. గౌరవం.",
        heroDesc: "వృద్ధులకు సురక్షిత మరియు దయతో కూడిన సంరక్షణ సేవలు.",
        servicesTitle: "మా సేవలు",
        service1: "హోమ్ నర్సింగ్",
        service2: "ఔషధ నిర్వహణ",
        service3: "స్మార్ట్ రిమైండర్లు",
        service4: "ఆరోగ్య రికార్డులు",
        service5: "అత్యవసర సహాయం",
        emergencyTitle: "అత్యవసర వ్యవస్థ",
        emergencyDesc: "ఒక ట్యాప్‌తో SOS. వెంటనే సమాచారం."
    }
};


// ================= LANGUAGE SWITCHER =================

document.addEventListener("DOMContentLoaded", function () {

    const dropdown = document.getElementById("languageSwitcher");
    const savedLang = localStorage.getItem("language") || "en";

    if (dropdown) {
        dropdown.value = savedLang;

        dropdown.addEventListener("change", function () {
            const lang = this.value;
            localStorage.setItem("language", lang);
            applyLanguage(lang);
        });
    }

    applyLanguage(savedLang);
});

function applyLanguage(lang) {

    if (!translations[lang]) return;

    Object.keys(translations[lang]).forEach(function(key) {

        const element = document.getElementById(key);

        if (element) {
            element.textContent = translations[lang][key];
        }

    });
}


// ================= DARK MODE =================

document.addEventListener("DOMContentLoaded", function () {

    const modeToggle = document.getElementById("modeToggle");
    if (!modeToggle) return;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        modeToggle.textContent = "☀";
    }

    modeToggle.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            modeToggle.textContent = "☀";
            localStorage.setItem("theme", "dark");
        } else {
            modeToggle.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }

    });

});


// ================= MEDICINE =================

function addMedicine() {

    const name = document.getElementById("medName").value;
    const dosage = document.getElementById("medDosage").value;
    const time = document.getElementById("medTime").value;

    if (!name || !dosage || !time) return;

    const meds = JSON.parse(localStorage.getItem("medicines")) || [];

    meds.push({ name, dosage, time });

    localStorage.setItem("medicines", JSON.stringify(meds));

    displayMedicines();

    document.getElementById("medName").value = "";
    document.getElementById("medDosage").value = "";
    document.getElementById("medTime").value = "";

}

function displayMedicines() {

    const list = document.getElementById("medicineList");
    if (!list) return;

    list.innerHTML = "";

    const meds = JSON.parse(localStorage.getItem("medicines")) || [];

    if (meds.length === 0) {

        list.innerHTML = `
        <tr>
        <td colspan="4">No medicines added yet</td>
        </tr>
        `;

        return;
    }

    meds.forEach((med, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${med.name}</td>
        <td>${med.dosage}</td>
        <td>${formatTime(med.time)}</td>
        <td><button onclick="deleteMedicine(${index})">❌</button></td>
        `;

        list.appendChild(row);

    });

}

function deleteMedicine(index) {

    const meds = JSON.parse(localStorage.getItem("medicines")) || [];
    meds.splice(index, 1);
    localStorage.setItem("medicines", JSON.stringify(meds));

    displayMedicines();

}

function formatTime(time) {

    const [hour, minute] = time.split(":");

    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;

}


// ================= EMERGENCY =================

function triggerSOS() {

    const status = document.getElementById("sosStatus");
    if (!status) return;

    status.innerHTML = "Sending alert to caregiver...";

    setTimeout(() => {
        status.innerHTML = "✅ Alert Sent Successfully!";
    }, 2000);

}


// ================= REMINDERS =================

function addReminder() {

    const text = document.getElementById("reminderText").value;
    const time = document.getElementById("reminderTime").value;

    if (!text || !time) return;

    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

    reminders.push({ text, time });

    localStorage.setItem("reminders", JSON.stringify(reminders));

    displayReminders();

    document.getElementById("reminderText").value = "";
    document.getElementById("reminderTime").value = "";
}

function displayReminders() {

    const list = document.getElementById("reminderList");
    if (!list) return;

    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

    list.innerHTML = "";

    if (reminders.length === 0) {

        list.innerHTML = `
        <tr>
            <td colspan="3">No reminders added yet</td>
        </tr>
        `;

        return;
    }

    reminders.forEach((reminder, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${reminder.text}</td>
            <td>${reminder.time}</td>
            <td>
                <button onclick="deleteReminder(${index})">Delete</button>
            </td>
        `;

        list.appendChild(row);
    });

}

function deleteReminder(index) {

    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];

    reminders.splice(index, 1);

    localStorage.setItem("reminders", JSON.stringify(reminders));

    displayReminders();

}


// ================= HEALTH RECORDS =================

function addRecord() {

    const type = document.getElementById("recordType").value;
    const value = document.getElementById("recordValue").value;
    const unit = document.getElementById("recordUnit").value;
    const date = document.getElementById("recordDate").value;
    const notes = document.getElementById("recordNotes").value;

    if (!type || !value) return;

    const records = JSON.parse(localStorage.getItem("healthRecords")) || [];

    records.push({ type, value, unit, date, notes });

    localStorage.setItem("healthRecords", JSON.stringify(records));

    displayRecords();

}

function displayRecords() {

    const list = document.getElementById("recordList");
    if (!list) return;

    const records = JSON.parse(localStorage.getItem("healthRecords")) || [];

    list.innerHTML = "";

    if (records.length === 0) {

        list.innerHTML = `
        <tr>
            <td colspan="6">No records added yet</td>
        </tr>
        `;

        return;
    }

    records.forEach((record, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${record.type}</td>
        <td class="${getHealthStatus(record.type, record.value)}">${record.value}</td>
        <td>${record.unit}</td>
        <td>${formatDate(record.date)}</td>
        <td>${record.notes}</td>
        <td><button onclick="deleteRecord(${index})">Delete</button></td>
        `;

        list.appendChild(row);

    });

}

function deleteRecord(index) {

    const records = JSON.parse(localStorage.getItem("healthRecords")) || [];

    records.splice(index, 1);

    localStorage.setItem("healthRecords", JSON.stringify(records));

    displayRecords();

}

function formatDate(dateString) {

    if (!dateString) return "";

    const date = new Date(dateString);

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    return date.toLocaleDateString("en-US", options);

}


// ================= AUTO UNIT =================

function setUnit() {

    const type = document.getElementById("recordType").value;
    const unitField = document.getElementById("recordUnit");

    if (type === "Blood Pressure") unitField.value = "mmHg";
    else if (type === "Temperature") unitField.value = "°C";
    else if (type === "Heart Rate") unitField.value = "bpm";
    else if (type === "Blood Sugar") unitField.value = "mg/dL";
    else if (type === "Allergy") unitField.value = "-";
    else unitField.value = "";

}


// ================= HEALTH STATUS =================

function getHealthStatus(type, value) {

    if (type === "Blood Pressure") {

        const parts = value.split("/");
        const systolic = parseInt(parts[0]);
        const diastolic = parseInt(parts[1]);

        if (systolic > 130 || diastolic > 85) {
            return "warning";
        } else {
            return "normal";
        }
    }

    value = parseFloat(value);

    if (type === "Temperature") {
        if (value > 37.5) return "warning";
        else return "normal";
    }

    if (type === "Heart Rate") {
        if (value > 100 || value < 60) return "warning";
        else return "normal";
    }

    if (type === "Blood Sugar") {
        if (value > 140) return "warning";
        else return "normal";
    }

    return "normal";
}

function triggerSOS(){

const status = document.getElementById("sosStatus");
if(!status) return;

status.innerHTML = "📡 Detecting your location...";

const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(

function(position){

const lat = position.coords.latitude;
const lon = position.coords.longitude;

const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;

if(contacts.length === 0){

status.innerHTML = `
⚠ No emergency contacts found.<br>
🚑 Calling ambulance (108)...<br>
📍 Your location:<br>
<a href="${mapLink}" target="_blank">View on Map</a>
`;

setTimeout(()=>{
window.location.href = "tel:108";
},3000);

return;

}

status.innerHTML = `
🚑 Emergency Alert Sent! <br>
📍 Your location:<br>
<a href="${mapLink}" target="_blank">View on Map</a><br>
📞 Notifying ${contacts.length} emergency contact(s).
`;

},

function(){

status.innerHTML = "⚠ Unable to detect location.";

}

);

}else{

status.innerHTML = "⚠ Geolocation not supported by this browser.";

}

}

function confirmSOS(){
const confirmAlert = confirm("Are you sure you want to send an emergency alert?");
if(confirmAlert){
triggerSOS();
}
}

function addContact(){

const name = document.getElementById("contactName").value;
const phone = document.getElementById("contactPhone").value;

if(!name || !phone) return;

const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

contacts.push({name, phone});

localStorage.setItem("contacts", JSON.stringify(contacts));

displayContacts();

document.getElementById("contactName").value = "";
document.getElementById("contactPhone").value = "";

}


function displayContacts(){

const list = document.getElementById("contactList");
if(!list) return;

const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

list.innerHTML = "";

contacts.forEach((contact,index)=>{

const li = document.createElement("li");

li.innerHTML = `
${contact.name} - ${contact.phone}
<button onclick="deleteContact(${index})">❌</button>
`;

list.appendChild(li);

});

}


function deleteContact(index){

const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

contacts.splice(index,1);

localStorage.setItem("contacts", JSON.stringify(contacts));

displayContacts();

}

document.addEventListener("DOMContentLoaded", displayContacts);

// ================= MEDICINE =================

function addMedicine() {
    const name = document.getElementById("medName").value;
    const dosage = document.getElementById("medDosage").value;
    const time = document.getElementById("medTime").value;

    if (!name || !dosage || !time) return alert("Enter medicine, dosage, and time");

    const meds = JSON.parse(localStorage.getItem("medicines")) || [];
    meds.push({ name, dosage, time });
    localStorage.setItem("medicines", JSON.stringify(meds));
    displayMedicines();

    document.getElementById("medName").value = "";
    document.getElementById("medDosage").value = "";
    document.getElementById("medTime").value = "";
}

function displayMedicines() {
    const list = document.getElementById("medicineList");
    if (!list) return;

    list.innerHTML = "";
    const meds = JSON.parse(localStorage.getItem("medicines")) || [];

    if (meds.length === 0) {
        list.innerHTML = `<tr><td colspan="4">No medicines added yet</td></tr>`;
        return;
    }

    meds.forEach((med, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${med.name}</td>
            <td>${med.dosage}</td>
            <td>${formatTime(med.time)}</td>
            <td><button onclick="deleteMedicine(${index})">❌</button></td>
        `;
        list.appendChild(row);
    });
}

function deleteMedicine(index) {
    const meds = JSON.parse(localStorage.getItem("medicines")) || [];
    meds.splice(index, 1);
    localStorage.setItem("medicines", JSON.stringify(meds));
    displayMedicines();
}

function formatTime(time) {
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${minute} ${ampm}`;
}



// Load medicines on page load
document.addEventListener("DOMContentLoaded", displayMedicines);


// ================= LOAD DATA =================

document.addEventListener("DOMContentLoaded", displayMedicines);
document.addEventListener("DOMContentLoaded", displayReminders);
document.addEventListener("DOMContentLoaded", displayRecords);

