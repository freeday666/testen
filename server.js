const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Een gebruiker verbonden');

    socket.on('chatbericht', (data) => {
        // stuur het bericht naar alle clients
        io.emit('chatbericht', data);
    });

    socket.on('disconnect', () => {
        console.log('Gebruiker verbroken');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server draait op port ${PORT}`);
});