let currentEmail = "";

document.getElementById("generate").addEventListener("click", () => {
  fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
    .then(res => res.json())
    .then(data => {
      currentEmail = data[0];
      document.getElementById("emailDisplay").innerText = currentEmail;
      document.getElementById("inbox").innerHTML = "";
    });
});

document.getElementById("refresh").addEventListener("click", () => {
  if (!currentEmail) {
    alert("Generate an email first.");
    return;
  }

  const [login, domain] = currentEmail.split("@");
  fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`)
    .then(res => res.json())
    .then(messages => {
      const inbox = document.getElementById("inbox");
      inbox.innerHTML = "";

      if (messages.length === 0) {
        inbox.innerHTML = "<p>No messages yet.</p>";
      } else {
        messages.forEach(msg => {
          const item = document.createElement("div");
          item.innerHTML = `<strong>${msg.from}</strong>: ${msg.subject}`;
          inbox.appendChild(item);
        });
      }
    })
    .catch(() => {
      document.getElementById("inbox").innerHTML = "<p>Error fetching messages.</p>";
    });
});
  
