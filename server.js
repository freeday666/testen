const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(':memory:'); // Voor productie, gebruik een persistent bestand
const JWT_SECRET = 'jouw-geheime-sleutel';

// Database setup
db.serialize(() => {
  // Gebruikers tabel
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT,
    password TEXT
  )`);

  // Servers tabel
  db.run(`CREATE TABLE servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    ip TEXT,
    port INTEGER,
    status TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Middleware voor authenticatie
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Geen token' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Ongeldige token' });
    req.user = user;
    next();
  });
}

// Registratie
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
    [username, email, hash],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'Gebruikersnaam of email bestaat al' });
      }
      res.json({ message: 'Gebruiker geregistreerd' });
    });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (!row) return res.status(400).json({ error: 'Gebruiker niet gevonden' });
    if (bcrypt.compareSync(password, row.password)) {
      const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Verkeerd wachtwoord' });
    }
  });
});

// Endpoint: Get alle servers van ingelogde gebruiker
app.get('/servers', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM servers WHERE user_id = ?`, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Fout bij ophalen servers' });
    res.json({ servers: rows });
  });
});

// Endpoint: Voeg een nieuwe server toe
app.post('/servers', authenticateToken, (req, res) => {
  const { name, ip, port } = req.body;
  const status = 'Offline'; // standaard status
  db.run(`INSERT INTO servers (user_id, name, ip, port, status) VALUES (?, ?, ?, ?, ?)`,
    [req.user.id, name, ip, port, status],
    function(err) {
      if (err) return res.status(500).json({ error: 'Fout bij toevoegen server' });
      res.json({ message: 'Server toegevoegd', serverId: this.lastID });
    });
});

// Endpoint: Verwijder een server
app.delete('/servers/:id', authenticateToken, (req, res) => {
  const serverId = req.params.id;
  // Controleer of server van ingelogde gebruiker is
  db.get(`SELECT * FROM servers WHERE id = ? AND user_id = ?`, [serverId, req.user.id], (err, row) => {
    if (!row) return res.status(404).json({ error: 'Server niet gevonden of geen toegang' });
    db.run(`DELETE FROM servers WHERE id = ?`, [serverId], (err2) => {
      if (err2) return res.status(500).json({ error: 'Fout bij verwijderen' });
      res.json({ message: 'Server verwijderd' });
    });
  });
});

// Endpoint: Update server status (bijvoorbeeld, via externe script of handmatig)
app.put('/servers/:id/status', authenticateToken, (req, res) => {
  const serverId = req.params.id;
  const { status } = req.body;
  // Controle of server van gebruiker is
  db.get(`SELECT * FROM servers WHERE id = ? AND user_id = ?`, [serverId, req.user.id], (err, row) => {
    if (!row) return res.status(404).json({ error: 'Server niet gevonden of geen toegang' });
    db.run(`UPDATE servers SET status = ? WHERE id = ?`, [status, serverId], (err2) => {
      if (err2) return res.status(500).json({ error: 'Fout bij bijwerken' });
      res.json({ message: 'Status bijgewerkt' });
    });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Backend draait op http://localhost:3000');
});