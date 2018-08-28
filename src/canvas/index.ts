import Gridding from '../views/gridding';
import View from '../views/base';

export default class Canvas {

    public canvas: HTMLCanvasElement;

    public context: CanvasRenderingContext2D;

    public currentView?: View;

    private el: HTMLElement;

    private elms: (View)[] = [];

    private gridding: Gridding;

    private willDraw = false;
    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * devicePixelRatio;
        this.canvas.width = w * devicePixelRatio;

        this.context = this.canvas.getContext('2d')!;

        this.context.scale(devicePixelRatio, devicePixelRatio);

        this.el.appendChild(this.canvas);

        this.gridding = new Gridding();
        this.gridding.rootCanvas = this;
        this.gridding.data.size = { w, h };
    }

    public addView(el: View) {
        el.rootCanvas = this;
        this.elms.push(el);
        this.forceUpdate();
    }

    public removeView(el: View) {
        const index = this.elms.findIndex(e => e === el);
        this.elms.splice(index, 1);
    }

    public draw = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.gridding.render(this.context);
        this.elms.forEach(el => {
            el.render(this.context);
        });
        this.willDraw = false;
    }

    public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.draw);
    }
}
