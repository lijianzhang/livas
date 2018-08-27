import { Canvas, LineView } from '../src';


const canvas = new Canvas(document.getElementById('canvas'), 891, 504);

canvas.draw();

let line: LineView = null;


canvas.canvas.addEventListener('mousedown', e => {
    line = new LineView();
    canvas.addView(line);
    line.data.lineWidth = 5;
    line.data.opacity = 1;
    line.data.strokeColor = '#ff5a5e';
    line.data.postion = { x: e.clientX, y: e.clientY };
    line.data.pos.push({ x: e.clientX, y: e.clientY });
});

canvas.canvas.addEventListener('mousemove', e => {
    if (!line) return;
    line.data.pos.push({ x: e.clientX, y: e.clientY });
});

canvas.canvas.addEventListener('mouseup', () => {
    line = null;
});


// for (let index = 0; index < 50; index += 1) {
//     const el = new LineView();
//     canvas.addView(el);
//     el.data.lineWidth = 5;
//     el.data.opacity = 1;
//     el.data.strokeColor = '#ff5a5e';
//     el.data.postion = { x: Math.floor(Math.random() * 891), y: Math.floor(Math.random() * 504) };
//     for (let i = 0; Math.floor(Math.random() * 100); i += 1) {
//         el.data.pos.push({ x: Math.floor(Math.random() * 891), y: Math.floor(Math.random() * 504) });
//     }
// }
