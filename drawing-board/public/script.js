const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => { drawing = true });
canvas.addEventListener('mouseup', () => { drawing = false });
canvas.addEventListener('mousemove', (event) => {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
});
