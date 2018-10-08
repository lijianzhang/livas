/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 03:00:18
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-05 19:38:11
 */
import Event, { EventTypes } from './event';

export default class EventManage {
    constructor(rootView: Livas.IView, canvas: HTMLCanvasElement) {
        this.rootView = rootView;
        this.canvas = canvas;
        this.init();
    }

    private rootView: Livas.IView;

    private canvas: HTMLCanvasElement;

    public getMouseView(point: Livas.gemo.IPoint, view: Livas.IView): Livas.IView | null {
        if (view.hitTest(point)) {
            if (view.subViews.length) {
                for (let index = 0; index < view.subViews.length; index += 1) {
                    const v = this.getMouseView(point, view.subViews[index]);
                    if (v) return v;
                }
            }

            return view;
        }

        return null;
    }

    public destroy() {
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    public init() {
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    private onMouseDown = (e: MouseEvent) => {
        if (e.target === this.canvas) {
            const postion = {x: e.offsetX, y: e.offsetY};
            let currentView = this.getMouseView(postion, this.rootView);
            if (currentView) {
                const event = new Event(EventTypes.mousedown, currentView, postion);
                while (!event.bubbles && currentView) {
                    if (currentView.onMouseDown) currentView.onMouseDown(event);
                    if (currentView.superView) {
                        currentView = currentView.superView;
                    } else {
                        currentView = null;
                    }
                }
                console.log(event.target.id);
            }
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        const postion = {x: e.offsetX, y: e.offsetY};
        let currentView = this.getMouseView(postion, this.rootView);
        if (currentView) {
            const event = new Event(EventTypes.mousemove, currentView, postion);
            while (!event.bubbles && currentView) {
                if (currentView.onMouseMove) currentView.onMouseMove(event);
                if (currentView.superView) {
                    currentView = currentView.superView;
                } else {
                    currentView = null;
                }
            }
        }
    }
    private onMouseUp = () => {
        console.log('onmuseup');
    }
}
