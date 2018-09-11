import View from './views/view';
import GraphicsContext from './graphics-context';
import Rect from './rect';

export default class WindowView {

    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * devicePixelRatio;
        this.canvas.width = w * devicePixelRatio;

        this.ctx =  new GraphicsContext(this.canvas.getContext('2d')!);

        this.el.appendChild(this.canvas);

        this.rootView = new View();

        this.rootView.backgroundColor = '#ff5a5e';
        this.rootView.frame = new Rect(200, 50, 200, 200);

        this.rootView.render(this.ctx);

    }

    public willDraw = true;

    public rootView: View;
    public canvas: HTMLCanvasElement;

    public ctx: GraphicsContext;

    public el: HTMLElement;

    public render = () => {
        this.ctx.setSize(this.rootView.frame);
        this.rootView.render(this.ctx);
        this.willDraw = false;
    }

    public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.render);
    }
}
