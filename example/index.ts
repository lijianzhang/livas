// import { CanvasView, BrushView, RectView, GroupView, GriddingView } from '../src';
import View from '../src/classes/views/view';
import Canvas from '../src/classes/canvas';
import { store } from 'liob';

(window as any).View = View;

// store.useLog();
const canvas = new Canvas(document.getElementById('canvas'), 800, innerHeight);
canvas.canvas.style.marginLeft = '40px';
// canvas.backgroundColor =  '#000';
(window as any).canvas = canvas;

// canvas.canvas.style.border = '1px solid lightgray';

// const gridding = new GriddingView();
// gridding.size = { w: innerWidth, h: innerHeight };
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

// for (let index = 0; index < 10000; index += 1) {
//     const el = new View();
//     el.layer.borderWidth = 1;
//     el.layer.borderColor = '#000';
//     el.backgroundColor = '#ff5a5e';
//     el.frame = { x: Math.floor(Math.random() * innerWidth), y: Math.floor(Math.random() * 504), w: 200, h: 200 };
//     canvas.addSubView(el);
// }
// canvas.draw();



// const group = new GroupView();
// // group.postion = {x: 200, y: 0};
// // group.rotate = 15;
// const rect =  new RectView();
// rect.lineWidth = 20;
// rect.postion = { x: 200, y: 200 };
// rect.color = '#ff5a5e';
// rect.size = { w: 200, h: 300 };
// // rect.rotate = -15;

// const rect1 =  new RectView();
// rect1.lineWidth = 4;
// rect1.color = 'blue';
// rect1.anchor = [0, 0];
// rect1.postion = { x: 200, y: 200 };
// rect1.size = { w: 200, h: 300 };
// rect1.rotate = 180;

// const rect2 =  new RectView();
// rect2.lineWidth = 4;
// // rect2.anchor = [1 / 2, 0];
// rect2.color = 'green';
// rect2.postion = { x: 200, y: 200 };
// rect2.size = { w: 200, h: 300 };
// rect2.rotate = 30;
// const grd = canvas.context.createLinearGradient(20, 100, 170, 0);
// grd.addColorStop(0, getRandomColor());
// grd.addColorStop(1, 'white');
// rect2.backgroundColor = grd;
// rect.backgroundColor = grd;
// rect1.backgroundColor = grd;
// group.addView(rect2);
// group.addView(rect);

// // canvas.addView(group);
// // group.addView(rect1);

// const rect3 = new RectView();
// rect3.size = { w: 200, h: 200 };
// rect3.lineWidth = 4;
// rect3.color = getRandomColor();
// // group.addView(rect3);


// const brush = new BrushView();

// brush.lineWidth = 10;
// brush.opacity = 0.8;
// brush.color = '#ff5a5e';
// brush.postions = [{x: 20, y: 20}, { x: 50, y: 50 }];

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
