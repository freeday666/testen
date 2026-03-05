// app.js

// Toggle chat zichtbaar
document.getElementById('chatBtn').addEventListener('click', () => {
  const chat = document.getElementById('chatContainer');
  chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
});

// Verstuur chatbericht
document.getElementById('sendBtn').addEventListener('click', () => {
  sendMessage();
});

// Also, je kunt Enter gebruiken om te versturen
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const input = document.getElementById('chatInput');
  const messageText = input.value.trim();
  if (messageText !== '') {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>Je:</strong> ${messageText}`;
    document.getElementById('chatMessages').appendChild(messageDiv);
    input.value = '';

    // FreddoBot reageert
    setTimeout(() => {
      botReply(messageText);
    }, 1000);
  }
}

function botReply(userMessage) {
  const botDiv = document.createElement('div');
  botDiv.className = 'bot';

  // Eenvoudige bot reactie
  botDiv.innerHTML = `<strong>FreddoBot:</strong> Je zei: "${userMessage}". Hoe kan ik je helpen?`;
  document.getElementById('chatMessages').appendChild(botDiv);
}

// Voorbeeld: inloggen en account maken knoppen
document.getElementById('loginBtn').addEventListener('click', () => {
  alert('Inloggen functionaliteit komt nog!');
});
document.getElementById('signupBtn').addEventListener('click', () => {
  alert('Account maken functionaliteit komt nog!');
});

// Optioneel: dynamisch de kijkerslijst aanpassen
// Hier kun je code toevoegen om kijkers te beheren