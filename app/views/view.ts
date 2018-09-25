import Layer from '../layers/layer';
import cachePool from '../utils/cache-pool';
import { Observer } from 'liob';

/*
 * @Author: lijianzhang
 * @Date: 2018-09-25 20:57:50
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-26 01:49:11
 */

export default class View {

    get cacheCanvasContext() {
        if (this._cacheCanvasContext) return this._cacheCanvasContext;
        if (!this.useCache) return false;
        const cache = cachePool.getCache();
        if (cache) {
            this._cacheCanvasContext = cache;
            this._cacheCanvasContext.imageSmoothingEnabled = false;

            return this._cacheCanvasContext;
        }

        return false;
    }
    constructor(x: number, y: number, w: number, h: number) {
        this.layer = new Layer(x, y, w, h);
        this.$observer = new Observer(() => {
            this.forceUpdate();
        }, `${this.constructor.name}.render()`);
    }

    public layer: Layer;

    public subViews: View[] = [];

    public superView?: View;

    public useCache = true;

    private $observer: Observer;

    /**
     * 缓存的离屏上下文
     *
     * @private
     * @type {CanvasRenderingContext2D}
     * @memberof BaseView
     */
    private _cacheCanvasContext?: CanvasRenderingContext2D;

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

    public removeView<T extends View>(view: T) {
        const index = this.subViews.findIndex(v => v === view);
        this.subViews.splice(index, 1);
        view.superView = undefined;
        view.destory();
    }

    public addView<T extends View>(view: T) {
        this.subViews.push(view);
        view.superView = this;
    }

    public addViews<T extends View>(views: T[]) {
        views.forEach(v => this.addView(v));
    }

    public destory() {
        console.log('destory');
    }

    private get x() {
        if (this.superView) {
            return this.superView.x + this.layer.x;
        }

        return this.layer.x;
    }

    private get y() {
        if (this.superView) {
            return this.superView.y + this.layer.y;
        }

        return this.layer.y;
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.$observer.beginCollectDep();
        if (!this.cacheCanvasContext) {
            ctx.save();
            ctx.translate(this.x, this.y);
            this.layer.draw(ctx);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.restore();
        } else {
            if (this.$observer.change) {
                this.cacheCanvasContext.save();
                this.cacheCanvasContext.canvas.width = this.layer.w + 2;
                this.cacheCanvasContext.canvas.height = this.layer.h + 2;
                this.layer.draw(this.cacheCanvasContext);
                this.cacheCanvasContext.restore();
            }
            const [width, height] = this.layer.size;
            const { a, b, c, d } = this.layer.matrix;

            ctx.drawImage(this.cacheCanvasContext.canvas, this.x - 1, this.y - 1, this.layer.w, this.layer.h);
        }
        if (this.subViews.length) {
            this.subViews.forEach(v => v.render(ctx));
        }
        this.$observer.endCollectDep();
    }
}
