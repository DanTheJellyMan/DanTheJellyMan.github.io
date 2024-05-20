const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let drawingData = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing drawing data to the new user
    socket.emit('init', drawingData);

    socket.on('draw', (data) => {
        drawingData.push(data);
        io.emit('draw', data); // Broadcast drawing data to all connected users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
