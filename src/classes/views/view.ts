import Layer from '../layers/layer';
import Rect from '../rect';

export default class View {

    constructor(rect: Rect = Rect.zero) {
        this.layer.frame = rect;
        this.layer.delegate = this;
    }
    public layer = new Layer();

    public displayLayer(layer: Layer) {

    }
}
