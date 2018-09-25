import Stage from '../app/views/stage';
import View from '../app/views/view';
import Layer from '../app/layers/layer';

const stage = new Stage(500, 500);
stage.layer.backgroundColor = '#ff5a5e';
stage.layer.borderWidth = 10;
stage.layer.borderColor = '#000';

const view = new View(200, 200, 50, 50);
view.layer.backgroundColor = '#0ff';

const view2 = new View(20, 0, 50, 50);
view2.layer.backgroundColor = '#000';

const layer = new Layer(20, 20, 20, 20);
layer.backgroundColor = '#000';
layer.matrix.rotate = 45;
const layer1 = new Layer(20, 20, 20, 20);
layer1.backgroundColor = '#00F';
view.layer.addLayer(layer);
view.layer.addLayer(layer1);
view2.layer.matrix.rotate = 45;
// view.layer.matrix.rotate = 15;
view2.addView(view);
stage.addView(view2);
// const view1 = new View(200, 200, 50, 50);
// view1.layer.backgroundColor = '#000';
// view1.layer.matrix.rotate = 35;
// stage.addView(view1);

(window as any).stage = stage;

document.body.appendChild(stage.canvas);
