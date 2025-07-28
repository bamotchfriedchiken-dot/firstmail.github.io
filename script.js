const emailDisplay = document.getElementById("email");
const timerDisplay = document.getElementById("timer");
const inboxDisplay = document.getElementById("inbox");

let email = "";
let countdown = 600; // 10 minutes in seconds
let countdownInterval;
let inboxInterval;

function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < 10; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // List of valid domains for 1secmail API
  const domains = ["1secmail.com", "1secmail.org", "1secmail.net", "xojxe.com", "wwjmp.com", "kekse.mail"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${name}@${domain}`;
}

function updateEmail() {
  email = generateRandomEmail();
  emailDisplay.innerText = email;
  countdown = 600;
  clearInterval(countdownInterval);
  clearInterval(inboxInterval);
  countdownInterval = setInterval(updateTimer, 1000);
  inboxInterval = setInterval(fetchInbox, 15000); // refresh inbox every 15 seconds
  fetchInbox();
}

function updateTimer() {
  if (countdown <= 0) {
    updateEmail(); // generate a new email automatically
    return;
  }
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  timerDisplay.innerText = `Expires in ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  countdown--;
}

async function fetchInbox() {
  if (!email) return;
  const [login, domain] = email.split("@");
  try {
    const response = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`);
    const messages = await response.json();
    if (!Array.isArray(messages)) throw new Error("Invalid response");
    inboxDisplay.innerHTML = "";
    if (messages.length === 0) {
      inboxDisplay.innerHTML = "<p>No messages yet.</p>";
      return;
    }
    for (const msg of messages) {
      const date = new Date(msg.date).toLocaleString();
      inboxDisplay.innerHTML += `
        <div style="margin-bottom:15px; padding:10px; border:1px solid #444; border-radius:5px; background:#222;">
          <strong>From:</strong> ${msg.from} <br/>
          <strong>Subject:</strong> ${msg.subject} <br/>
          <strong>Date:</strong> ${date}
        </div>
      `;
    }
  } catch (error) {
    inboxDisplay.innerHTML = "<p>Error fetching messages.</p>";
    console.error("Fetch inbox error:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateEmail();
  document.getElementById("generateBtn").addEventListener("click", updateEmail);
  document.getElementById("refreshBtn").addEventListener("click", fetchInbox);
});
