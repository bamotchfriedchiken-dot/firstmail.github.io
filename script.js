// script.js

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const emailField = document.getElementById("email");
  const copyBtn = document.getElementById("copyBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  generateBtn.addEventListener("click", generateEmail);
  copyBtn.addEventListener("click", copyEmail);
  refreshBtn.addEventListener("click", generateEmail);

  // Auto-generate email on page load
  generateEmail();

  async function generateEmail() {
    try {
      const res = await fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
      if (!res.ok) throw new Error("Erreur de réponse API");
      const data = await res.json();
      const email = data[0];
      emailField.value = email;
    } catch (error) {
      console.error("Erreur lors de la génération du mail:", error);
      emailField.value = "Erreur lors de la génération du mail";
    }
  }

  function copyEmail() {
    emailField.select();
    document.execCommand("copy");
    alert("Adresse copiée dans le presse-papiers ✅");
  }
});
