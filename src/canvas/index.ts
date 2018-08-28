import Gridding from '../views/gridding';
import View from '../views/base';
import { getElementOffset } from '../utils/dom';
import { IPostion } from '../types/postion';

type MOUSE_EVENT = "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup";

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

    addMouseEventListener(type: MOUSE_EVENT, listener: (this: HTMLCanvasElement, ev: MouseEvent, pos: IPostion) => any, options?: boolean | AddEventListenerOptions) {
        const canvas = this.canvas;
        function handle(this: HTMLCanvasElement, e: MouseEvent) {
            const offset = getElementOffset(canvas);
            return listener.call(this, e, { x: e.clientX - offset.left, y: e.clientY - offset.top });
        }
        this.canvas.addEventListener(type, handle, options);
        return () => this.canvas.removeEventListener(type, handle);
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
        // requestAnimationFrame(this.draw);
    }

    public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.draw);
    }
}
