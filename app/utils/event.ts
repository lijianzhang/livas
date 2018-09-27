import View from '../views/view';
import Stage from '../views/stage';
import { getElementOffset } from './dom';
import globalStore from '../store/global';
import Tool from '../tools/tool';

export interface IViewEvent {
    subViews?: IViewEvent[];
    onMouseDown?(e: IEvent): boolean | undefined;
    onMouseUp?(e: IEvent): boolean | undefined;
    onMouseDrag?(e: IEvent);
    onMouseDragEnd?(e: IEvent);
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
        document.addEventListener('mousedown', (e) => {
            if (e.target === this.stage.canvas) this.onMouseDown(e);
        });
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    private stage: Stage;

    private mousedown = false;

    private dragView?: View;

    private currentViews: Set<View>  = new Set();

    public getOffset(e) {
        return getElementOffset(e.target);
    }

    public getMouseView(xy: [number, number]) {
        let currentView: View;
        if (globalStore.currentView) currentView = globalStore.currentView.hitTest(xy);
        if (currentView && currentView !== globalStore.currentView) return currentView;

        for (let index = 0; index < this.stage.tools.length; index += 1) {
            const view = this.stage.tools[index].hitTest(xy);
            if (view) {
                currentView = view;
                break;
            }
        }
        if (currentView) return currentView;

        return this.stage.hitTest(xy);
    }

    private onMouseDown = (e: MouseEvent) => {
        this.mousedown = true;
        globalStore.mouse.pos = [e.offsetX, e.offsetY];
        let currentView = this.getMouseView(globalStore.mouse.pos);

        if (!(currentView instanceof Tool)) {
            globalStore.currentView = currentView;
        }
        globalStore.mouse.target = currentView;

        let bubbling = true;
        while (bubbling && currentView) {
            bubbling = currentView.onMouseDown ? !!currentView.onMouseDown(globalStore.mouse) : true;
            console.log(currentView);
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
        globalStore.mouse.prePos = globalStore.mouse.pos;
        globalStore.mouse.pos = [e.offsetX, e.offsetY];

        let currentView = this.getMouseView([e.offsetX, e.offsetY]);

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
        if (this.dragView && this.dragView.onMouseDragEnd) this.dragView.onMouseDragEnd(globalStore.mouse);
        this.dragView = undefined;
    }
}
