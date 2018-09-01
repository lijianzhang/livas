import { CanvasView, BrushView, RectView, GroupView } from '../src';

const canvas = new CanvasView(document.getElementById('canvas'), innerWidth, innerHeight);

canvas.canvas.style.border = '1px solid #000';

// 线条
let line: BrushView = null;
canvas.onMouseDown = (_, pos) => {
    line = new BrushView();
    canvas.addView(line);
    line.lineWidth = 26;
    line.opacity = 0.8;
    line.strokeColor = '#ff5a5e';
    line.postions.push(pos);

    return false;
};

canvas.onMouseMove = (_, pos) => {
    if (!line) return;
    // line.data.postions = [...line.data.postions, { x: e.clientX, y: e.clientY }];
    (window as any).a = line;
    line.postions.push(pos);

    return false;
};

canvas.onMouseUp = () => {
    line = null;

    return false;
};

//矩形
// let rect: RectView = null;
// let preX = 0;
// let preY = 0;
// canvas.addMouseEventListener('mousedown', (_, pos) => {
//     rect = new RectView();
//     canvas.addView(rect);
//     rect.data.lineWidth = 1;
//     rect.data.opacity = 1;
//     rect.data.strokeColor = '#ff5a5e';
//     rect.data.backgroundColor =  '#ff5a5e';
//     rect.data.postion = pos;
//     preX = pos.x;
//     preY = pos.y;

// });

// canvas.addMouseEventListener('mousemove', (_, pos) => {
//     if (!rect) return;
//     const diffX = pos.x - preX;
//     const diffY = pos.y - preY;
//     rect.data.size.w += diffX;
//     rect.data.size.h += diffY;
//     // rect.changed = true;
//     preX = pos.x;
//     preY = pos.y;
// });

// canvas.canvas.addEventListener('mouseup', () => {
//     rect = null;
//     preX = 0;
//     preY = 0;
// });

// for (let index = 0; index < 100; index += 1) {
//     const el = new RectView();
//     canvas.addView(el);
//     el.lineWidth = 1;
//     el.opacity = 1;
//     el.strokeColor = '#ff5a5e';

//     el.postion = { x: Math.floor(Math.random() * innerWidth), y: Math.floor(Math.random() * 504) };
//     el.size = { w: 999, h: 999 };
// }
// canvas.draw();



const group = new GroupView();
group.size = canvas.size;
group.postion = canvas.postion;
const rect =  new RectView();
rect.lineWidth = 2;
rect.strokeColor = '#ff5a5e';

rect.size = { w: 50, h: 50 };
group.addView(rect);

canvas.addView(group);

const brush = new BrushView();

brush.lineWidth = 10;
brush.opacity = 0.8;
brush.strokeColor = '#ff5a5e';
brush.postions = [{x: 20, y: 20}, { x: 50, y: 50 }];

group.addView(brush);

// group.onMouseDown = () => {
//     for (let index = 0; index < 100; index += 1) {
//         group.subViews[index].postion.x += 1;
//     }

//     return false;
// };



for (let index = 0; index < 100; index += 1) {
    const el = new RectView();
    el.lineWidth = 1;
    el.opacity = 1;
    el.strokeColor = '#ff5a5e';

    el.postion = { x: Math.floor(Math.random() * innerWidth), y: Math.floor(Math.random() * 504) };
    el.size = { w: Math.floor(Math.random() * 30), h: Math.floor(Math.random() * 30) };
    group.addView(el);
}

setInterval(() => {
    for (let index = 0; index < 100; index += 1) {
        group.subViews[index].postion.x += 1;
    }
}, 1);
