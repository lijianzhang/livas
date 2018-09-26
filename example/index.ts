import Stage from '../app/views/stage';
import View from '../app/views/view';
import Layer from '../app/layers/layer';

const stage = new Stage(500, 500);
stage.layer.borderWidth = 1;
stage.layer.borderColor = '#000';

const view = new View(200, 200, 50, 50);
view.layer.backgroundColor = '#0ff';

const view2 = new View(20, 100, 200, 200);
view2.layer.backgroundColor = '#f00';

const layer = new Layer(20, 20, 20, 20);
layer.backgroundColor = '#000';

const layer1 = new Layer(20, 20, 20, 20);
layer1.backgroundColor = '#00F';
view.layer.addLayer(layer);
view.layer.addLayer(layer1);

// view.layer.matrix.rotate = 15;
view2.addView(view);
stage.addView(view2);
// const view1 = new View(200, 200, 50, 50);
// view1.layer.backgroundColor = '#000';
// view1.layer.matrix.rotate = 35;
// stage.addView(view1);

(window as any).stage = stage;

document.body.appendChild(stage.canvas);
