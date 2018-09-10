import View from './view';
import GraphicsContext from '../graphics-context';
import Rect from '../rect';

export default class WindowView extends View {

    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        super();
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * devicePixelRatio;
        this.canvas.width = w * devicePixelRatio;

        this.ctx =  new GraphicsContext(this.canvas.getContext('2d')!);

        this.el.appendChild(this.canvas);

        this.layer.backgroundColor = '#ff5a5e';

        this.layer.frame = new Rect(50, 50, 200, 200);
        this.layer.transform = this.layer.transform.rotateBy(45);

        this.layer.render(this.ctx);

    }
    public canvas: HTMLCanvasElement;

    public ctx: GraphicsContext;

    public el: HTMLElement;
}
