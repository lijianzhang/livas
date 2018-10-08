 import { Stage, View } from '../src';

const stage = new Stage(500, 500);

stage.view.layer.backgroundColor = '#ff5a5e';

const view = new View({ x: 100, y: 100, width: 60, height: 60 });
const view2 = new View({ x: 50, y: 200, width: 60, height: 60 });

view.backgroundColor = '#000';
view2.backgroundColor = '#000';

stage.view.addSubView(view);
stage.view.addSubView(view2);

const subView = new View({ x: 10, y: 10, width: 20, height: 20 });
subView.backgroundColor = '#fff';
view.addSubView(subView);

stage.draw();

(window as any).stage = stage;
(window as any).view = view;
(window as any).subView = subView;

document.body.appendChild(stage.canvas);
