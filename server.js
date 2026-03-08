// chat.js
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Load chat history from localStorage
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
chatHistory.forEach(msg => {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = msg;
  chatContainer.appendChild(msgDiv);
});

// Send message
sendBtn.onclick = () => {
  const message = chatInput.value.trim();
  if (message) {
    // Add to chat display
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Save to history
    chatHistory.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    // Clear input
    chatInput.value = '';
  }
};

// Optional: send message on Enter key
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});
