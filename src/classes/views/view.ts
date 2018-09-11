import { Observer } from 'liob';
import Layer from '../layers/layer';
import Rect from '../rect';
import { IPoint } from '../point';
import { IRect } from '../../types';
import CachePool from '../../utils/cache-pool';

let id = 0;
const cachePool = new CachePool();
export default class View {

    get frame() {
        return this.layer.frame;
    }

    set frame(rect: IRect) {
        this.layer.frame = rect;
    }

    get backgroundColor() {
        return this.layer.backgroundColor;
    }

    set backgroundColor(color: string) {
        this.layer.backgroundColor = color;
    }

    get cacheContext() {
        if (this._cacheContext) return this._cacheContext;
        if (!this.useCache) return false;
        const cache = cachePool.getCache();
        if (cache) {
            this._cacheContext = cache;
            this._cacheContext.imageSmoothingEnabled = false;

            return this._cacheContext;
        }

        return false;
    }

    constructor(rect: IRect = Rect.zero()) {
        this.layer.frame = rect;
        this.layer.delegate = this;
        id += id;
        this.id = id;
        this.$observer = new Observer(() => {
            this.forceUpdate();
        }, `${this.constructor.name}.render()`);
    }

    public $observer: Observer;

    public id: number;

    public layer = new Layer();

    public superView?: View;

    public subViews: View[] = [];

    public useCache = true;

    public _cacheContext?: CanvasRenderingContext2D;

    private needUpdate = true;

    public removeFromSuperLayer() {
        if (this.superView) {
            const index = this.superView.subViews.findIndex(l => l === l);
            if (index > -1) this.superView.subViews.splice(index, 1);
            this.superView = undefined;
        }
    }

    public insertSubViewAt(at: number, view: View) {
        this.subViews.splice(at, 0, view);
        view.superView = this;
    }

    public insertSubViewBelow(below: number, view: View) {
        this.subViews.splice(below - 1, 0, view);
        view.superView = this;
    }

    public insertSublaerAbove(ablove: number, view: View) {
        this.subViews.splice(ablove + 1, 0, view);
        view.superView = this;
    }

    public replaceSublaer(view: View, withLayer: View) {
        const index = this.subViews.findIndex(l => l === view);
        if (index > -1) {
            this.subViews[index].superView = undefined;
            this.subViews.splice(index, 1, withLayer);
        }
        view.superView = this;
    }

    public addSubView(view: View) {
        this.subViews.push(view);
        view.superView = this;
    }

    public hitTest(pos: IPoint) {
        return !!this.layer.hitTest(pos);
    }

    public forceUpdate() {
        if (this.superView) {
            this.superView.forceUpdate();
        }
    }

    public renderSubLayers(ctx: CanvasRenderingContext2D) {
        if (this.subViews.length) {
            this.subViews.forEach(v => v.render(ctx));
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        const { w, h, x , y } = this.layer.frame;
        if (this.needUpdate) {
            this.$observer.beginCollectDep();
            if (this.cacheContext) {
                this.cacheContext.canvas.width = this.frame.w;
                this.cacheContext.canvas.height = this.frame.h;
                this.layer.render(this.cacheContext);
            } else {
                this.layer.render(ctx);
            }
            this.needUpdate = false;
            this.$observer.endCollectDep();
        }

        if (this.cacheContext) {
            ctx.drawImage(
                this.cacheContext.canvas,
                x - 1, y - 1, w, h
            );
        }
    }
}
