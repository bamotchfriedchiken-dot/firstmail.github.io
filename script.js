const emailInput = document.getElementById("email");
const generateBtn = document.getElementById("generate");
const refreshBtn = document.getElementById("refresh");
const messagesDiv = document.getElementById("messages");

let currentEmail = "";
let currentId = "";

async function generateEmail() {
  const res = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
  const data = await res.json();
  currentEmail = data[0];
  emailInput.value = currentEmail;
  currentId = currentEmail.split("@")[0];
  messagesDiv.innerHTML = `<p>No messages yet...</p>`;
}

async function fetchMessages() {
  if (!currentEmail) return;
  const domain = currentEmail.split("@")[1];
  const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${currentId}&domain=${domain}`);
  const data = await res.json();

  if (data.length === 0) {
    messagesDiv.innerHTML = `<p>No messages yet...</p>`;
    return;
  }

  messagesDiv.innerHTML = data.map(msg => `
    <div class="message">
      <p><strong>From:</strong> ${msg.from}</p>
      <p><strong>Subject:</strong> ${msg.subject}</p>
      <a href="https://www.1secmail.com/mailbox/?action=readMessage&login=${currentId}&domain=${domain}&id=${msg.id}" target="_blank">Read</a>
    </div>
  `).join('');
}

generateBtn.addEventListener("click", generateEmail);
refreshBtn.addEventListener("click", fetchMessages);

// Auto-generate on load
generateEmail();
    
