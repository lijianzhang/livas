import { CanvasView, BrushView, RectView, GroupView, GriddingView } from '../src';
import { store } from 'liob';

// store.useLog();
const canvas = new CanvasView(document.getElementById('canvas'), innerWidth, innerHeight);

canvas.canvas.style.border = '1px solid #000';

const gridding = new GriddingView();
gridding.size = { w: innerWidth, h: innerHeight };
// canvas.addView(gridding);

// 线条
// let line: BrushView = null;
// canvas.onMouseDown = (_, pos) => {
//     line = new BrushView();
//     canvas.addView(line);
//     line.lineWidth = 10;
//     // line.opacity = 1;
//     line.color = getRandomColor();
//     line.postions.push(pos);

//     return false;
// };

// canvas.onMouseMove = (_, pos) => {
//     if (!line) return;
//     // line.data.postions = [...line.data.postions, { x: e.clientX, y: e.clientY }];
//     (window as any).a = line;
//     line.postions.push(pos);

//     return false;
// };

// canvas.onMouseUp = () => {
//     if (line.postions.length < 2) {
//         canvas.removeView(line);
//     }
//     line = null;

//     return false;
// };

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
// group.postion = { x: 50, y: 50 };
const rect =  new RectView();
rect.lineWidth = 2;
rect.postion = { x: 200, y: 200 };
rect.color = '#ff5a5e';
rect.size = { w: 200, h: 200 };
rect.rotate = 30;

const rect1 =  new RectView();
rect1.lineWidth = 2;
rect1.color = 'blue';
rect1.postion = { x: 200, y: 200 };
rect1.size = { w: 200, h: 200 };

// group.addView(rect1);
group.addView(rect);

canvas.addView(group);

const brush = new BrushView();

brush.lineWidth = 10;
brush.opacity = 0.8;
brush.color = '#ff5a5e';
brush.postions = [{x: 20, y: 20}, { x: 50, y: 50 }];

// group.addView(brush);

// group.onMouseDown = () => {
//     group.postion.x += 1;

//     return true;
// };


function getRandomColor() {
    return '#' + (function(h) { return new Array(7 - h.length).join('0') + h; })((Math.random() * 0x1000000 << 0).toString(16)); // tslint:disable-line
  }
// for (let index = 0; index < 5; index += 1) {
//     const el = new RectView();
//     el.lineWidth = Math.floor(Math.random() * 5);
//     el.opacity = 1;

//     const grd = canvas.context.createLinearGradient(20, 100, 170, 0);
//     grd.addColorStop(0, getRandomColor());
//     grd.addColorStop(1, 'white');
//     Math.random() > 0.5 ? el.color = getRandomColor() : el.backgroundColor = getRandomColor();
//     el.backgroundColor = grd;
//     el.color = getRandomColor();
//     el.rotate = Math.ceil(Math.random() * 180);
//     el.postion = { x: Math.floor(Math.random() * innerWidth), y: Math.floor(Math.random() * innerHeight) };
//     el.size = { w: 200, h: 200 };
//     group.addView(el);
// }

// setInterval(() => {
//     group.postion.x += 300;
// }, 11000);

const time = 0;

function a() {
    // if (time > 600) return;
    group.postion.x += 2;
    group.postion.y += 2;
}

requestAnimationFrame(a);
