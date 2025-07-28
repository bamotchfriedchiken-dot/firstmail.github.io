const emailDisplay = document.getElementById("emailDisplay");
const messagesDiv = document.getElementById("messages");
let currentEmail = "";
let emailId = "";

document.getElementById("generate").addEventListener("click", async () => {
  const res = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
  const data = await res.json();
  currentEmail = data[0];
  emailDisplay.textContent = currentEmail;
  messagesDiv.innerHTML = "";
  emailId = currentEmail.split("@")[0];
});

document.getElementById("refresh").addEventListener("click", async () => {
  if (!currentEmail) {
    alert("Please generate an email first.");
    return;
  }

  try {
    const domain = currentEmail.split("@")[1];
    const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${emailId}&domain=${domain}`);
    const messages = await res.json();
    messagesDiv.innerHTML = "";

    if (messages.length === 0) {
      messagesDiv.innerHTML = "<p>No messages yet.</p>";
      return;
    }

    for (let msg of messages) {
      const detailRes = await fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${emailId}&domain=${domain}&id=${msg.id}`);
      const detail = await detailRes.json();
      const msgEl = document.createElement("div");
      msgEl.className = "message";
      msgEl.innerHTML = `<strong>From:</strong> ${detail.from}<br><strong>Subject:</strong> ${detail.subject}<br><p>${detail.textBody || "(no content)"}</p>`;
      messagesDiv.appendChild(msgEl);
    }
  } catch (err) {
    messagesDiv.innerHTML = "<p>Error fetching messages.</p>";
    console.error(err);
  }
});
    
