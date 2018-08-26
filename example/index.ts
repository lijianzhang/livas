import { Canvas, LineView, RectView } from  '../src';


const canvas = new Canvas(document.getElementById('canvas'), 1920, 1080);

const el = new LineView();

el.data.lineWidth = 20;
el.data.opacity = 1;
el.data.strokeColor = '#ff5a5e';

const el1 = new RectView();
const el2 = new RectView();

el1.data.set('size', { w: 100, h: 100 });
el1.data.set('opacity', 0.4);

canvas.addView(el1);
canvas.addView(el);


canvas.draw();

canvas.canvas.addEventListener('mousemove', e => {
    el.data.pos.push({ x: e.clientX, y: e.clientY });
});