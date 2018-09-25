import Stage from '../app/views/stage';
import View from '../app/views/view';

const stage = new Stage(500, 500);
stage.layer.backgroundColor = '#ff5a5e';
stage.layer.borderWidth = 10;
stage.layer.borderColor = '#000';

const view = new View(200, 200, 50, 50);
view.layer.backgroundColor = '#0ff';
stage.addView(view);
const view1 = new View(200, 200, 50, 50);
view1.layer.backgroundColor = '#000';
view1.layer.matrix.rotate = 35;
stage.addView(view1);

(window as any).stage = stage;

document.body.appendChild(stage.canvas);
