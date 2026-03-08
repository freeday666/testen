// chat.js
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
chatHistory.forEach(msg => {
  const div = document.createElement('div');
  div.textContent = msg;
  chatContainer.appendChild(div);
});

sendBtn.onclick = () => {
  const msg = chatInput.value.trim();
  if (msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    chatHistory.push(msg);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    chatInput.value = '';
  }
};

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});
