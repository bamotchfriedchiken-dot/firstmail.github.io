// Sélection des éléments du DOM
const emailInput = document.getElementById("email");
const generateBtn = document.getElementById("generate");
const refreshBtn = document.getElementById("refresh");
const messagesDiv = document.getElementById("messages");

// Variables pour stocker l'adresse email et l'identifiant
let currentEmail = "";
let currentId = "";

// Fonction pour générer une nouvelle adresse email
async function generateEmail() {
  try {
    const res = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
    const data = await res.json();

    currentEmail = data[0];
    currentId = currentEmail.split("@")[0];

    emailInput.value = currentEmail;
    messagesDiv.innerHTML = `<p class="info">No messages yet...</p>`;
  } catch (error) {
    console.error("Erreur lors de la génération de l’email :", error);
    messagesDiv.innerHTML = `<p class="error">Erreur lors de la génération. Réessayez.</p>`;
  }
}

// Fonction pour récupérer les messages
async function fetchMessages() {
  if (!currentEmail) return;

  try {
    const domain = currentEmail.split("@")[1];
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
    console.error("Erreur lors de la récupération des messages :", error);
    messagesDiv.innerHTML = `<p class="error">Impossible de charger les messages. Réessayez.</p>`;
  }
}

// Ajout des écouteurs d'événement sur les boutons
generateBtn?.addEventListener("click", generateEmail);
refreshBtn?.addEventListener("click", fetchMessages);

// Génération automatique d'une adresse email à l'ouverture de la page
generateEmail();
      
