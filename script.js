const emailInput = document.getElementById("email");
const generateBtn = document.getElementById("generate");
const refreshBtn = document.getElementById("refresh");
const messagesDiv = document.getElementById("messages");

let currentEmail = "";
let currentId = "";

// Génère une adresse email temporaire
async function generateEmail() {
  try {
    const res = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
    const data = await res.json();

    if (!data[0]) throw new Error("Email not generated.");

    currentEmail = data[0];
    currentId = currentEmail.split("@")[0];
    emailInput.value = currentEmail;
    messagesDiv.innerHTML = `<p>No messages yet...</p>`;
  } catch (error) {
    messagesDiv.innerHTML = `<p style="color:red;">❌ Error generating mail: ${error.message}</p>`;
  }
}

// Récupère les messages
async function fetchMessages() {
  if (!currentEmail) return;

  try {
    const domain = currentEmail.split("@")[1];
    const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${currentId}&domain=${domain}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      messagesDiv.innerHTML = `<p>No messages yet...</p>`;
      return;
    }

    messagesDiv.innerHTML = data.map(msg => `
      <div class="message">
        <p><strong>From:</strong> ${msg.from}</p>
        <p><strong>Subject:</strong> ${msg.subject}</p>
        <a href="https://www.1secmail.com/mailbox/?action=readMessage&login=${currentId}&domain=${domain}&id=${msg.id}" target="_blank">📨 Read</a>
      </div>
    `).join('');
  } catch (error) {
    messagesDiv.innerHTML = `<p style="color:red;">❌ Error fetching messages: ${error.message}</p>`;
  }
}

// Événements
generateBtn.addEventListener("click", generateEmail);
refreshBtn.addEventListener("click", fetchMessages);

// Génère automatiquement un mail au chargement
window.addEventListener("DOMContentLoaded", generateEmail);
