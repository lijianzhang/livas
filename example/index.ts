 import { Stage, View } from '../src';

const stage = new Stage(500, 500);

stage.view.layer.backgroundColor = '#ff5a5e';

const view = new View({ x: 100, y: 100, width: 60, height: 60 });

view.backgroundColor = '#000';

stage.view.addSubView(view);

stage.draw();

(window as any).stage = stage;
(window as any).view = view;

document.body.appendChild(stage.canvas);
