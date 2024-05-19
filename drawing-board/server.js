// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'
];

let playerColors = {};
let drawingData = [];
const password = 'bbl drizzy';

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.emit('requestPassword');

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        delete playerColors[socket.id];
    });

    socket.on('password', (enteredPassword) => {
        if (enteredPassword === password) {
            console.log('User authenticated: ' + socket.id);
            // Assign a color to the new player
            playerColors[socket.id] = colors[Object.keys(playerColors).length % colors.length];

            // Send existing drawing data to the new user
            for (const data of drawingData) {
                socket.emit('draw', data);
            }
        } else {
            console.log('Invalid password attempt from user: ' + socket.id);
            socket.emit('invalidPassword');
            socket.disconnect();
        }
    });

    socket.on('draw', (data) => {
        data.color = playerColors[socket.id];
        drawingData.push(data);
        io.emit('draw', data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
