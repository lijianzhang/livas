import GroupView from './group';
import LayerView from './layer';
import { getElementOffset } from '../utils/dom';
import { IPostion } from '../types';

type MOUSE_EVENT = 'mousedown' | 'mouseenter' | 'mouseleave' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup';

export default class Canvas extends GroupView  {

    public canvas: HTMLCanvasElement;

    public context: CanvasRenderingContext2D;

    public type = 'canvas';

    public useCache = false;

    private el: HTMLElement;

    private willDraw = false;

    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        super();
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * devicePixelRatio;
        this.canvas.width = w * devicePixelRatio;

        this.postion = { x: 0, y: 0 };

        this.size = { w, h };

        this.context = this.canvas.getContext('2d')!;

        this.context.scale(devicePixelRatio, devicePixelRatio);

        this.el.appendChild(this.canvas);

        this.addMouseEventListener('mousedown', this.mouseDown.bind(this));
        this.addMouseEventListener('mousemove', this.mouseMove.bind(this));
        this.addMouseEventListener('mouseup', this.mouseUp.bind(this));
        this.forceUpdate();
    }



    public render = () => {
        this.$observer.beginCollectDep();
        if (this.visible && !this.isEmpty) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.save();
            this.privateRender(this.context);
            this.context.restore();
        }
        this.$observer.endCollectDep();
        this.willDraw = false;
    }

    public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.render);
    }

    private mouseDown(e: MouseEvent, pos: IPostion) {
        return this.handeMouseEvent(e, pos, 'onMouseDown');
    }

    private mouseMove(e: MouseEvent, pos: IPostion) {
        return this.handeMouseEvent(e, pos, 'onMouseMove');
    }

    private mouseUp(e: MouseEvent, pos: IPostion) {
        return this.handeMouseEvent(e, pos, 'onMouseUp');
    }

    private addMouseEventListener(
        type: MOUSE_EVENT,
        listener: (this: HTMLCanvasElement, ev: MouseEvent, pos: IPostion) => any,
        options?: boolean | AddEventListenerOptions
    ) {
        const canvas = this.canvas;
        function handle(this: HTMLCanvasElement, e: MouseEvent) {
            const offset = getElementOffset(canvas);

            listener.call(this, e, { x: e.clientX - offset.left, y: e.clientY - offset.top });
        }
        this.canvas.addEventListener(type, handle, options);

        return () => this.canvas.removeEventListener(type, handle);
    }

    private handeMouseEvent(e: MouseEvent, pos: IPostion, fncName: string) {
        let view = this.getHandleEventView(e, pos);
        let bubbling = true;
        while (bubbling && view) {
            bubbling = view[fncName] ? view[fncName](e, pos) : true;
            if (view.parentView) {
                view = view.parentView;
            } else {
                bubbling = false;
            }
        }


        return false;
    }

    private getHandleEventView(e: MouseEvent, pos: IPostion, view: LayerView = this): LayerView {
        if (view.subViews) {
            for (const v of view.subViews.reverse()) {
                if (v.pointInside(pos)) {
                    return this.getHandleEventView(e, pos, v);
                }
            }
        }

        return view;
    }
}
