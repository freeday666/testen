// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve de statische bestanden uit de 'public' map
app.use(express.static('public'));

// Wanneer een gebruiker verbindt
io.on('connection', (socket) => {
    console.log('Een gebruiker verbonden');

    // Ontvang chatbericht van client
    socket.on('chatbericht', (data) => {
        // Verstuur het bericht naar alle clients inclusief de verzender
        io.emit('chatbericht', data);
    });

    // Gebruiker verbreekt verbinding
    socket.on('disconnect', () => {
        console.log('Gebruiker verbroken');
    });
});

// Start server op poort 3000 of omgeving variabele
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server draait op poort ${PORT}`);
});