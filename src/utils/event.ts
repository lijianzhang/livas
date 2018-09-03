import { CanvasView, LayerView, GroupView } from '../view';
import { IPostion } from '../types';
import globalStore from '../store/global';
import { getElementOffset } from './dom';

export interface IViewEvent {
    subViews?: IViewEvent[];
    onMouseDown?(e: IEventObj): boolean | undefined;
    onMouseUp?(e: IEventObj): boolean | undefined;
    onMouseDrag?(e: IEventObj);
    onMouseMove?(e: IEventObj);
    onmouseLeave?(e: IEventObj);
    onMouseEnter?(e: IEventObj);
    pointInside(pos: IPostion): boolean;
}

export interface IEventObj {
    pos: IPostion;
    prePos: IPostion;
}

export default class Event {

    constructor(canvas: CanvasView) {
        this.canvas = canvas;
        this.canvas.context.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.context.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.context.canvas.addEventListener('mouseup', this.onMouseUp);
    }

    private canvas: CanvasView;

    private mousedown = false;

    private dragViews: Set<LayerView> = new Set();

    private currentViews: Set<LayerView>  = new Set();

    public getOffset(e) {
        return getElementOffset(e.target);
    }

    private onMouseDown = (e: MouseEvent) => {
        this.mousedown = true;
        let currentView = this.getHandleEventView(globalStore.mouse.pos, this.canvas);
        if (currentView.type.indexOf('tool') === -1) {
            globalStore.currentView = currentView;
        }
        // const { left, top } = getElementOffset(e.target);
        globalStore.mouse.pos = { x: e.offsetX, y: e.offsetY };
        // globalStore.mouse.pos = { x: left + e.offsetX, y: top + e.offsetY };
        let bubbling = true;
        while (bubbling && currentView) {
            bubbling = currentView.onMouseDown ? !!currentView.onMouseDown(globalStore.mouse) : true;
            if (currentView.onMouseDrag) this.dragViews.add(currentView);
            if (currentView.parentView) {
                currentView = currentView.parentView;
            } else {
                bubbling = false;
            }
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        const preViews = this.currentViews;
        const currentViews: Set<LayerView> = new Set();

        globalStore.mouse.prePos = globalStore.mouse.pos;
        // const { left, top } = getElementOffset(e.target);
        console.log(e.offsetX, e.offsetY);
        // console.log(e.clientX, e.clientY);
        globalStore.mouse.pos = { x: e.offsetX, y: e.offsetY };
        const currentView = this.getHandleEventView(globalStore.mouse.pos, this.canvas);

        if (this.mousedown) {
            console.log('drag');
            this.dragViews.forEach(v => v.onMouseDrag!(globalStore.mouse));
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
            (currentView as any) = currentView.parentView;
            if (!currentView) {
                bubbling = false;
            }
        }

        preViews.forEach(v => {
            if (v.onMouseLeave) v.onMouseLeave();
        });

        this.currentViews = currentViews;
    }

    private onMouseUp = (e: MouseEvent) => {
        this.mousedown = false;
        this.dragViews = new Set();
    }

    private getHandleEventView(pos: IPostion, view: LayerView | GroupView): LayerView {
        if (view.subViews) {
            for (let index = (view as GroupView).sortSubViews.length - 1; index >= 0; index -= 1) {
                if ((view as GroupView).sortSubViews[index].pointInside(pos)) {
                    return this.getHandleEventView(pos, (view as GroupView).sortSubViews[index]);
                }
            }
        }

        return view;
    }
}
