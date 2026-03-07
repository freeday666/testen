<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Freddo Hosting Pro</title>
<style>
  body {
    font-family: 'Arial', sans-serif;
    margin: 0; padding: 0;
    background-color: #121212;
    color: #fff;
  }

  header {
    background-color: #1f1f1f;
    padding: 20px;
    text-align: center;
  }

  header h1 {
    margin: 0;
    font-size: 2em;
  }

  .buttons {
    margin-top: 20px;
  }

  button {
    background-color: #4CAF50;
    border: none;
    padding: 15px 30px;
    margin: 10px;
    font-size: 1em;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }

  main {
    padding: 20px;
    max-width: 900px;
    margin: auto;
  }

  /* Modal styles */
  .modal {
    display: none;
    position: fixed;
    z-index: 999;
    left: 0; top: 0;
    width: 100%; height: 100%;
    background-color: rgba(0,0,0,0.8);
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: #222;
    padding: 20px;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
  }

  .close {
    float: right;
    font-size: 1.5em;
    cursor: pointer;
  }

  input[type=text], input[type=password], input[type=email] {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  /* Server lijst tabel */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    padding: 12px;
    border: 1px solid #444;
    text-align: left;
  }

  th {
    background-color: #333;
  }

  /* Buttons in table */
  .action-btn {
    padding: 8px 12px;
    margin: 2px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete-btn {
    background-color: #e74c3c;
    color: white;
  }
</style>
</head>
<body>
<header>
  <h1>Freddo Hosting Pro</h1>
  <div class="buttons">
    <button id="btnRegister">Account maken</button>
    <button id="btnLogin">Inloggen</button>
    <button id="btnLogout" style="display:none;">Uitloggen</button>
  </div>
</header>

<main>
  <h2>Mijn Servers</h2>
  <button id="btnAddServer">Server toevoegen</button>

  <div id="serverContainer" style="margin-top:20px;">
    <!-- Server lijst komt hier -->
  </div>
</main>

<!-- Register Modal -->
<div id="registerModal" class="modal">
  <div class="modal-content">
    <span class="close" id="closeRegister">&times;</span>
    <h3>Account Aanmaken</h3>
    <form id="registerForm">
      <input type="text" placeholder="Gebruikersnaam" id="regUsername" required />
      <input type="email" placeholder="Email" id="regEmail" required />
      <input type="password" placeholder="Wachtwoord" id="regPassword" required />
      <button type="submit">Aanmelden</button>
    </form>
  </div>
</div>

<!-- Login Modal -->
<div id="loginModal" class="modal">
  <div class="modal-content">
    <span class="close" id="closeLogin">&times;</span>
    <h3>Inloggen</h3>
    <form id="loginForm">
      <input type="text" placeholder="Gebruikersnaam" id="loginUsername" required />
      <input type="password" placeholder="Wachtwoord" id="loginPassword" required />
      <button type="submit">Inloggen</button>
    </form>
  </div>
</div>

<!-- Server toevoegen Modal -->
<div id="addServerModal" class="modal">
  <div class="modal-content">
    <span class="close" id="closeAddServer">&times;</span>
    <h3>Server toevoegen</h3>
    <form id="addServerForm">
      <input type="text" placeholder="Servernaam" id="serverName" required />
      <input type="text" placeholder="IP-adres" id="serverIP" required />
      <input type="number" placeholder="Poort" id="serverPort" required />
      <button type="submit">Toevoegen</button>
    </form>
  </div>
</div>

<script>
const apiUrl = 'http://localhost:3000'; // Pas aan als nodig

let authToken = null;

// Elementen
const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const addServerModal = document.getElementById('addServerModal');

const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const btnAddServer = document.getElementById('btnAddServer');

const closeRegister = document.getElementById('closeRegister');
const closeLogin = document.getElementById('closeLogin');
const closeAddServer = document.getElementById('closeAddServer');

const serverContainer = document.getElementById('serverContainer');

// Open modals
btnRegister.onclick = () => { registerModal.style.display = 'flex'; }
btnLogin.onclick = () => { loginModal.style.display = 'flex'; }
btnAddServer.onclick = () => { addServerModal.style.display = 'flex'; }

// Sluit modals
closeRegister.onclick = () => { registerModal.style.display = 'none'; }
closeLogin.onclick = () => { loginModal.style.display = 'none'; }
closeAddServer.onclick = () => { addServerModal.style.display = 'none'; }

window.onclick = (event) => {
  if (event.target == registerModal) registerModal.style.display = 'none';
  if (event.target == loginModal) loginModal.style.display = 'none';
  if (event.target == addServerModal) addServerModal.style.display = 'none';
}

// Registratie
document.getElementById('registerForm').onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const response = await fetch(apiUrl + '/register', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  const data = await response.json();
  if (response.ok) {
    alert('Registratie gelukt! Log in.');
    registerModal.style.display = 'none';
  } else {
    alert('Fout: ' + data.error);
  }
}

// Inloggen
document.getElementById('loginForm').onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const response = await fetch(apiUrl + '/login', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (response.ok) {
    authToken = data.token;
    alert('Inloggen gelukt!');
    loginModal.style.display = 'none';
    btnLogout.style.display = 'inline-block';
    loadServers();
  } else {
    alert('Fout: ' + data.error);
  }
}

// Uitloggen
btnLogout.onclick = () => {
  authToken = null;
  alert('Uitgelogd');
  btnLogout.style.display = 'none';
  serverContainer.innerHTML = '';
}

// Server toevoegen
document.getElementById('addServerForm').onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('serverName').value;
  const ip = document.getElementById('serverIP').value;
  const port = parseInt(document.getElementById('serverPort').value);

  const response = await fetch(apiUrl + '/servers', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + authToken
    },
    body: JSON.stringify({ name, ip, port })
  });
  const data = await response.json();
  if (response.ok) {
    alert('Server toegevoegd!');
    addServerModal.style.display = 'none';
    loadServers();
  } else {
    alert('Fout: ' + data.error);
  }
}

// Laad servers
async function loadServers() {
  const response = await fetch(apiUrl + '/servers', {
    headers: { 'Authorization': 'Bearer ' + authToken }
  });
  if (response.ok) {
    const data = await response.json();
    showServers(data.servers);
  } else {
    alert('Authenticatie verlopen, log opnieuw in.');
    authToken = null;
  }
}

// Toon server lijst
function showServers(servers) {
  serverContainer.innerHTML = '';
  if (servers.length === 0) {
    serverContainer.innerHTML = '<p>Geen servers gevonden.</p>';
    return;
  }

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  ['Naam', 'IP', 'Poort', 'Status', 'Acties'].forEach(text => {
    const th = document.createElement('th');
    th.innerText = text;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  servers.forEach(server => {
    const row = document.createElement('tr');

    // Naam
    const nameTd = document.createElement('td');
    nameTd.innerText = server.name;
    row.appendChild(nameTd);

    // IP
    const ipTd = document.createElement('td');
    ipTd.innerText = server.ip;
    row.appendChild(ipTd);

    // Poort
    const portTd = document.createElement('td');
    portTd.innerText = server.port;
    row.appendChild(portTd);

    // Status
    const statusTd = document.createElement('td');
    statusTd.innerText = server.status;
    row.appendChild(statusTd);

    // Acties
    const actionsTd = document.createElement('td');

    // Verwijder knop
    const delBtn = document.createElement('button');
    delBtn.innerText = 'Verwijder';
    delBtn.className = 'action-btn delete-btn';
    delBtn.onclick = () => deleteServer(server.id);
    actionsTd.appendChild(delBtn);

    // Status bijwerken knop (optioneel)
    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = server.status === 'Online' ? 'Uitzetten' : 'Aanzetten';
    toggleBtn.className = 'action-btn';
    toggleBtn.onclick = () => updateServerStatus(server.id, server.status === 'Online' ? 'Offline' : 'Online');
    actionsTd.appendChild(toggleBtn);

    row.appendChild(actionsTd);
    table.appendChild(row);
  });

  serverContainer.appendChild(table);
}

// Verwijder server
async function deleteServer(serverId) {
  if (!confirm('Weet je zeker dat je deze server wilt verwijderen?')) return;
  const response = await fetch(apiUrl + '/servers/' + serverId, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + authToken }
  });
  if (response.ok) {
    alert('Server verwijderd');
    loadServers();
  } else {
    alert('Fout bij verwijderen');
  }
}

// Update server status
async function updateServerStatus(serverId, status) {
  const response = await fetch(apiUrl + '/servers/' + serverId + '/status', {
    method: 'PUT',
    headers: {
      'Content-Type':'application/json',
      'Authorization': 'Bearer ' + authToken
    },
    body: JSON.stringify({ status })
  });
  if (response.ok) {
    alert('Status bijgewerkt');
    loadServers();
  } else {
    alert('Fout bij bijwerken');
  }
}
</script>
</body>
</html>