import View from './views/view';
import Rect from './rect';
import Event from '../utils/event';

export default class CanvasView extends View {

    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        super();
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * devicePixelRatio;
        this.canvas.width = w * devicePixelRatio;
        this.frame = Rect.init(0, 0, w, h);

        this.ctx = this.canvas.getContext('2d')!;

        this.el.appendChild(this.canvas);

        this.event = new Event(this);


        const subLayer = new View();
        subLayer.backgroundColor = '#ff5a5e';
        subLayer.layer.borderColor = '#000';
        subLayer.layer.borderWidth = 2;
        subLayer.layer.anchor = [0.5, 0];
        // subLayer.layer.transform.rotateBy(30);
        subLayer.frame = Rect.init(0, 0, 200, 300);

        const subLayer1 = new View();
        subLayer1.backgroundColor = '#000';
        subLayer1.layer.borderColor = '#000';
        subLayer1.layer.borderWidth = 2;
        subLayer1.layer.anchor = [0, 0];
        subLayer1.layer.transform.rotateBy(30);
        subLayer1.frame = Rect.init(100, 20, 30, 30);
        subLayer.layer.transform.translatedBy(100, 100);
        this.addSubView(subLayer);
        subLayer.addSubView(subLayer1);

        this.update();

    }

     public event: Event;

    public willDraw = true;

    public canvas: HTMLCanvasElement;

    public ctx: CanvasRenderingContext2D;

    public el: HTMLElement;


    public update = () => {
        const { w, h } = this.frame;
        this.ctx.canvas.width = w;
        this.ctx.canvas.height = h;

        this.render(this.ctx);
        this.willDraw = false;
    }

    public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.update);
    }
}
