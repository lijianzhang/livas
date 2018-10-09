 import { CanvasRender, View } from '../src';

const rootView = new View({ x: 0, y: 0, height: 500, width: 500 });
const render = new CanvasRender(rootView);

rootView.layer.backgroundColor = '#ff5a5e';

const view = new View({ x: 100, y: 100, width: 60, height: 60 });
const view2 = new View({ x: 50, y: 200, width: 60, height: 60 });

view.backgroundColor = '#000';
view2.backgroundColor = '#000';

rootView.addSubView(view);
rootView.addSubView(view2);

const subView = new View({ x: 10, y: 10, width: 20, height: 20 });
subView.backgroundColor = '#fff';
view.addSubView(subView);

render.draw();

(window as any).stage = rootView;
(window as any).view = view;
(window as any).subView = subView;

document.body.appendChild(render.canvas);
