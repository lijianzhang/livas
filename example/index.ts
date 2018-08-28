import { Canvas, BrushView, RectView } from '../src';


const canvas = new Canvas(document.getElementById('canvas'), 891, 504);

canvas.draw();

// 线条
// let line: BrushView = null;
// canvas.canvas.addEventListener('mousedown', e => {
//     line = new BrushView();
//     canvas.addView(line);
//     line.data.lineWidth = 26;
//     line.data.opacity = 1;
//     line.data.strokeColor = '#ff5a5e';
//     line.data.postions.push({ x: e.clientX, y: e.clientY });
// });

// canvas.canvas.addEventListener('mousemove', e => {
//     if (!line) return;
//     line.data.postions.push({ x: e.clientX, y: e.clientY });
// });

// canvas.canvas.addEventListener('mouseup', () => {
//     line = null;
// });

//矩形
let rect: RectView = null;
let preX = 0;
let preY = 0;
canvas.canvas.addEventListener('mousedown', e => {
    rect = new RectView();
    canvas.addView(rect);
    rect.data.lineWidth = 1;
    rect.data.opacity = 1;
    rect.data.strokeColor = '#ff5a5e';
    rect.data.isFill = Math.random() > 0.5;
    rect.data.fillColor = '#ff5a5e';
    rect.data.postion = ({ x: e.clientX, y: e.clientY });
    preX = e.clientX;
    preY = e.clientY;

});

canvas.canvas.addEventListener('mousemove', e => {
    if (!rect) return;
    const diffX = e.clientX - preX;
    const diffY = e.clientY - preY;
    rect.data.size.w += diffX;
    rect.data.size.h += diffY;
    preX = e.clientX;
    preY = e.clientY;
});

canvas.canvas.addEventListener('mouseup', () => {
    rect = null;
    preX = 0;
    preY = 0;
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
