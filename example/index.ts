import { Canvas, BrushView, RectView } from '../src';

const canvas = new Canvas(document.getElementById('canvas'), innerWidth, 504);

canvas.canvas.style.border = '1px solid #000';

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
canvas.addMouseEventListener('mousedown', (_, pos) => {
    rect = new RectView();
    canvas.addView(rect);
    rect.data.lineWidth = 1;
    rect.data.opacity = 1;
    rect.data.strokeColor = '#ff5a5e';
    rect.data.backgroundColor =  Math.random() > 0.5 ? '#ff5a5e' : '';
    rect.data.postion = pos;
    preX = pos.x;
    preY = pos.y;

});

canvas.addMouseEventListener('mousemove', (_, pos) => {
    if (!rect) return;
    const diffX = pos.x - preX;
    const diffY = pos.y - preY;
    rect.data.size.w += diffX;
    rect.data.size.h += diffY;
    // rect.changed = true;
    preX = pos.x;
    preY = pos.y;
});

canvas.canvas.addEventListener('mouseup', () => {
    rect = null;
    preX = 0;
    preY = 0;
});

for (let index = 0; index < 2000; index += 1) {
    const el = new RectView();
    canvas.addView(el);
    el.data.lineWidth = 5;
    el.data.opacity = 1;
    el.data.strokeColor = '#ff5a5e';
    el.data.backgroundColor =  Math.random() > 0.5 ? '#ff5a5e' : '';
    el.data.postion = { x: Math.floor(Math.random() * innerWidth), y: Math.floor(Math.random() * 504) };
    el.data.size = { w: 20, h: 20 };
}
// canvas.draw();