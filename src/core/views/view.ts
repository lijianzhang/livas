import Layer from '../layer';
import { Observer } from 'liob';
/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 13:52:19
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-05 19:38:44
 */
let id = 0;

export default class View implements Livas.IView {
    constructor(frame: Livas.gemo.IRect) {
        id += 1;
        this.id = id;
        this.layer = new Layer(frame);
        this.$observer = new Observer(() => {
            this.forceUpdate();
        });
        this.cacheKey = this.id;
    }

    public name = 'view';

    public cacheKey?: string | symbol | number;

    public layer: Layer;

    public subViews: View[] = [];

    public superView?: View;

    public readonly id: number;

    private $observer: Observer;

    get hasChange() {
        return this.$observer.change;
    }

    get backgroundColor() {
        return this.layer.backgroundColor;
    }

    set backgroundColor(v: string) {
        this.layer.backgroundColor = v;
    }

    get frame() {
        return this.layer.frame;
    }

    set frame(v) {
        this.layer.frame = v;
    }

    get bounds() {
        return this.layer.bounds;
    }

    set bounds(v) {
        this.layer.bounds = v;
    }

    get transform() {
        return this.layer.transform;
    }

    set transform(v) {
        this.layer.transform = v;
    }

    get globalRect() {
        let x = this.layer.frame.x + this.layer.drawRect.x;
        let y = this.layer.frame.x + this.layer.drawRect.y;

        if (this.superView) {
            const rect = this.superView.globalRect;
            x += rect.x;
            y += rect.y;
        }

        return { x, y, width: this.layer.drawRect.width, height: this.layer.drawRect.height };
    }

    public hitTest(point: Livas.gemo.IPoint) {
        const { x, y, width, height } = this.globalRect;
        if (point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height) return true;

        return false;
    }

    public removeSubView<T extends View>(view: T) {
        const index = this.subViews.findIndex(v => v === view);
        this.subViews.splice(index, 1);
        view.superView = undefined;
    }

    public addSubView<T extends View>(layer: T) {
        this.subViews.push(layer);
        layer.superView = this;
    }

    public addSubViews<T extends View>(views: T[]) {
        views.forEach(v => this.addSubView(v));
    }

    /**
     * 触发更新
     *
     * @memberof View
     */
    public forceUpdate() {
        if (this.superView) {
            this.superView.forceUpdate();
        }
    }

    public render(ctx: Livas.IReanderContenxt) {
        this.$observer.beginCollectDep();
        this.layer.draw(ctx);
        this.$observer.endCollectDep();
    }
}
