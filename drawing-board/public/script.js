const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
const socket = io();

let drawing = false;

// Function to start drawing
canvas.addEventListener('mousedown', () => { drawing = true });
canvas.addEventListener('mouseup', () => { drawing = false });
canvas.addEventListener('mousemove', draw);

// Function to draw on the canvas
function draw(event) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();

    // Send drawing data to the server
    socket.emit('draw', { x, y });
}

// Receive drawing data from the server
socket.on('draw', (data) => {
    context.lineTo(data.x, data.y);
    context.stroke();
});

// Receive initial drawing data from the server
socket.on('init', (drawingData) => {
    drawingData.forEach(data => {
        context.lineTo(data.x, data.y);
        context.stroke();
    });
});
