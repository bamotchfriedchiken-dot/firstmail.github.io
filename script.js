document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const generateBtn = document.getElementById("generate");
  const refreshBtn = document.getElementById("refresh");
  const messagesDiv = document.getElementById("messages");

  let currentEmail = "";
  let currentId = "";

  // Génére une adresse email temporaire
  async function generateEmail() {
    try {
      const res = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
      const data = await res.json();
      currentEmail = data[0];
      currentId = currentEmail.split("@")[0];
      emailInput.value = currentEmail;
      messagesDiv.innerHTML = `<p class="info">No messages yet...</p>`;
    } catch (error) {
      messagesDiv.innerHTML = `<p class="error">Erreur lors de la génération d'email</p>`;
      console.error(error);
    }
  }

  // Rafraîchit la boîte de réception
  async function fetchMessages() {
    if (!currentEmail) return;

    const domain = currentEmail.split("@")[1];
    try {
      const res = await fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${currentId}&domain=${domain}`);
      const data = await res.json();

      if (data.length === 0) {
        messagesDiv.innerHTML = `<p class="info">No messages yet...</p>`;
        return;
      }

      messagesDiv.innerHTML = data.map(msg => `
        <div class="message">
          <p><strong>From:</strong> ${msg.from}</p>
          <p><strong>Subject:</strong> ${msg.subject}</p>
          <a href="https://www.1secmail.com/mailbox/?action=readMessage&login=${currentId}&domain=${domain}&id=${msg.id}" target="_blank">Read</a>
        </div>
      `).join('');
    } catch (error) {
      messagesDiv.innerHTML = `<p class="error">Erreur lors de la récupération des messages</p>`;
      console.error(error);
    }
  }

  // Ajout des écouteurs d'événements
  generateBtn.addEventListener("click", generateEmail);
  refreshBtn.addEventListener("click", fetchMessages);

  // Génère un email automatiquement au chargement
  generateEmail();
});
    
