import View from '../views/view';
import { getElementOffset } from './dom';

export interface IViewEvent {
    subViews?: IViewEvent[];
    onMouseDown?(e: IEvent): boolean | undefined;
    onMouseUp?(e: IEvent): boolean | undefined;
    onMouseDrag?(e: IEvent);
    onMouseMove?(e: IEvent);
    onMouseLeave?(e: IEvent);
    onMouseEnter?(e: IEvent);
    hitTest(pos: [number, number]): View | null;
}

export interface IEvent {
    pos: IPostion;
    prePos: IPostion;
}

export default class Event {

    constructor(canvas: View) {
        this.canvas = canvas;
        this.canvas.ctx.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.ctx.canvas.addEventListener('mousemove', this.onMouseMove);
        document.body.addEventListener('mouseup', this.onMouseUp);
    }

    private canvas: View;

    private mousedown = false;

    private dragView?: View;

    private currentViews: Set<View>  = new Set();

    public getOffset(e) {
        return getElementOffset(e.target);
    }

    private onMouseDown = (e: MouseEvent) => {
        console.log(e);
        this.mousedown = true;
        let currentView = this.canvas.hitTest(globalStore.mouse.pos);
        if (currentView) console.log(currentView.frame);
        // if (currentView.type.indexOf('tool') === -1) {
        //     globalStore.currentView = currentView;
        // }
        // const { left, top } = getElementOffset(e.target);
        globalStore.mouse.pos = { x: e.offsetX, y: e.offsetY };
        // globalStore.mouse.pos = { x: left + e.offsetX, y: top + e.offsetY };
        let bubbling = true;
        while (bubbling && currentView) {
            bubbling = currentView.onMouseDown ? !!currentView.onMouseDown(globalStore.mouse) : true;
            if (!this.dragView && currentView.onMouseDrag) this.dragView = currentView;
            if (currentView.superView) {
                currentView = currentView.superView;
            } else {
                bubbling = false;
            }
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        const preViews = this.currentViews;
        const currentViews: Set<View> = new Set();


        // const { left, top } = getElementOffset(e.target);
        // console.log(e.clientX, e.clientY);
        console.log(e.offsetX);
        const currentView = this.canvas.hitTest([e.offsetX, e.offsetY]);

        if (this.mousedown && this.dragView) {
            this.dragView.onMouseDrag!(globalStore.mouse);
        }

        let bubbling = true;
        while (currentView) {

            if (bubbling) {
                bubbling = currentView.onMouseDown ? !!currentView.onMouseDown(globalStore.mouse) : true;
            }

            if (currentView.onMouseEnter) {
                if (!preViews.has(currentView)) {
                    currentView.onMouseEnter(globalStore.mouse);
                }
            }

            preViews.delete(currentView);
            currentViews.add(currentView);
            (currentView as any) = currentView.superView;
            if (!currentView) {
                bubbling = false;
            }
        }

        preViews.forEach(v => {
            if (v.onMouseLeave) v.onMouseLeave();
        });

        this.currentViews = currentViews;
    }

    private onMouseLeave = () => {
        this.mousedown = false;
        this.dragView = undefined;
        this.currentViews = new Set();
    }

    private onMouseUp = (e: MouseEvent) => {
        this.mousedown = false;
        this.dragView = undefined;
    }
}
