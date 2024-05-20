// public/script.js
const socket = io();

const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

let drawing = false;
let current = {};

function throttle(callback, delay) {
    let previousCall = new Date().getTime();
    return function() {
        const time = new Date().getTime();

        if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
        }
    };
}

function drawLine(x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }

    const w = canvas.width;
    const h = canvas.height;

    socket.emit('draw', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h
    });
}

function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX - canvas.getBoundingClientRect().left;
    current.y = e.clientY - canvas.getBoundingClientRect().top;
}

function onMouseUp(e) {
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top, socket.color, true);
}

function onMouseMove(e) {
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top, socket.color, true);
    current.x = e.clientX - canvas.getBoundingClientRect().left;
    current.y = e.clientY - canvas.getBoundingClientRect().top;
}

canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

socket.on('draw', (data) => {
    const w = canvas.width;
    const h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
});