import View from '../views/view';
import Stage from '../views/stage';
import { getElementOffset } from './dom';
import globalStore from '../store/global';

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
    pos: [number, number];
    prePos: [number, number];
}

export default class Event {

    constructor(stage: Stage) {
        this.stage = stage;
        this.stage.canvas.addEventListener('mousedown', this.onMouseDown);
        this.stage.canvas.addEventListener('mousemove', this.onMouseMove);
        document.body.addEventListener('mouseup', this.onMouseUp);
    }

    private stage: Stage;

    private mousedown = false;

    private dragView?: View;

    private currentViews: Set<View>  = new Set();

    public getOffset(e) {
        return getElementOffset(e.target);
    }

    private onMouseDown = (e: MouseEvent) => {
        this.mousedown = true;
        let currentView = this.stage.hitTest(globalStore.mouse.pos);
        globalStore.mouse.pos = [e.offsetX, e.offsetY];
        globalStore.currentView = currentView;

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

        let currentView = this.stage.hitTest([e.offsetX, e.offsetY]);
        console.log(currentView);

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
            currentView = currentView.superView;
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
