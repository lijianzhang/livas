import Gridding from '../views/gridding';
import View from '../views/base';

export default class Canvas {
    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * window.devicePixelRatio;
        this.canvas.width = w * window.devicePixelRatio;
    
        this.context = this.canvas.getContext('2d')!;

        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.el.appendChild(this.canvas);

        this.gridding = new Gridding();
        this.gridding.data.set('size', { w, h });
    }

    private el: HTMLElement;

    canvas: HTMLCanvasElement;

    context: CanvasRenderingContext2D;

    private elms: View[] = [];

    private gridding: Gridding;

    private willDraw = false;

    addView(el: View) {
        el.rootCanvas = this;
        this.elms.push(el);
    }
    
    draw = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.gridding.draw(this.context);
        this.elms.forEach(el => {
            this.context.save();
            el.draw(this.context)
            this.context.restore();
        });
        this.willDraw = false;
    }

    readDraw() {
        if (this.willDraw) return;
        this.willDraw = true;
        window.requestAnimationFrame(this.draw);
    }
}