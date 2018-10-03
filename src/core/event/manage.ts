/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 03:00:18
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 19:34:17
 */
import Event from './event';

export default class EventManage {
    constructor(rootView: Livas.IView, canvas: HTMLCanvasElement) {
        this.rootView = rootView;
        this.canvas = canvas;
    }

    private rootView: Livas.IView;

    private canvas: HTMLCanvasElement;

    public getMouseView(point: Livas.gemo.IPoint, view: Livas.IView): Livas.IView | null {
        if (this.rootView.hitTest(point)) {
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
                const event = new Event(Livas.EventTypes.mousedown, currentView, postion);
                while (!event.isStop && currentView) {
                    if (currentView.onMouseDown) currentView.onMouseDown(event);
                    if (currentView.superView) {
                        currentView = currentView.superView;
                    }
                }
            }
        }
    }

    private onMouseMove = (e: MouseEvent) => {
        const postion = {x: e.offsetX, y: e.offsetY};
        let currentView = this.getMouseView(postion, this.rootView);
        if (currentView) {
            const event = new Event(Livas.EventTypes.mousemove, currentView, postion);
            while (!event.isStop && currentView) {
                if (currentView.onMouseMove) currentView.onMouseMove(event);
                if (currentView.superView) {
                    currentView = currentView.superView;
                }
            }
        }
    }
    private onMouseUp = () => {
        console.log('onmuseup');
    }
}
