const emailDisplay = document.getElementById("email");
const timerDisplay = document.getElementById("timer");
const inboxDisplay = document.getElementById("inbox");

let email = "";
let countdown = 600;
let intervalId;

function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let name = "";
  for (let i = 0; i < 10; i++) {
    name += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${name}@1secmail.com`;
}

function updateEmail() {
  email = generateRandomEmail();
  emailDisplay.innerText = email;
  countdown = 600;
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(updateTimer, 1000);
  fetchInbox();
}

function updateTimer() {
  if (countdown <= 0) {
    updateEmail();
    return;
  }
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  timerDisplay.innerText = `Expires in ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  countdown--;
}

function fetchInbox() {
  if (!email) return;
  const [login, domain] = email.split("@");
  fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)
    .then((response) => response.json())
    .then((messages) => {
      inboxDisplay.innerHTML = "";
      if (messages.length === 0) {
        inboxDisplay.innerHTML = "<p>No messages yet.</p>";
        return;
      }
      messages.forEach((msg) => {
        inboxDisplay.innerHTML += `<div><strong>From:</strong> ${msg.from}<br><strong>Subject:</strong> ${msg.subject}</div><hr>`;
      });
    })
    .catch(() => {
      inboxDisplay.innerHTML = "<p>Error fetching messages.</p>";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  updateEmail();
  document.getElementById("generateBtn").addEventListener("click", updateEmail);
  document.getElementById("refreshBtn").addEventListener("click", fetchInbox);
});
