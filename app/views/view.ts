import Layer from '../layers/layer';
import Responder from './responder';
import cachePool from '../utils/cache-pool';
import { Observer } from 'liob';

/*
 * @Author: lijianzhang
 * @Date: 2018-09-25 20:57:50
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-27 01:02:56
 */

let id = 0;
export default class View extends Responder {

    get cacheCanvasContext() {
        if (this._cacheCanvasContext) return this._cacheCanvasContext;
        if (!this.useCache) return false;
        let cache: CanvasRenderingContext2D;

        if (typeof this.useCache === 'string') {
            const cache = cachePool.getCacheWithId(this.useCache);
        } else {
            cache = cachePool.getCache();
        }

        if (cache) {
            this._cacheCanvasContext = cache;
            this._cacheCanvasContext.imageSmoothingEnabled = false;

            return this._cacheCanvasContext;
        }

        return false;
    }

    get x() {
        if (this.superView) {
            return this.superView.x + this.layer.x;
        }

        return this.layer.x;
    }

    set x(v: number) {
        const diffX = this.x - this.layer.x;
        this.layer.x = v - diffX;
    }

    get y() {
        if (this.superView) {
            return this.superView.y + this.layer.y;
        }

        return this.layer.y;
    }

    set y(v: number) {
        const diffY = this.y - this.layer.y;
        this.layer.y = v - diffY;
    }


    get size() {
        return this.layer.size;
    }

    get w() {
        return this.layer.w;
    }

    set w(v: number) {
        this.layer.w = v;
    }

    get h() {
        return this.layer.h;
    }

    set h(v: number) {
        this.layer.h = v;
    }

    constructor(x: number, y: number, w: number, h: number) {
        super();
        id += 1;
        this.id = id;
        this.layer = new Layer(x, y, w, h);
        this.$observer = new Observer(() => {
            this.forceUpdate();
        }, `${this.constructor.name}.render()`);
    }

    // 按顺序 n, wn, w, ws, s, se, e, ne
    public dots = 0b11111111;

    public id: number;

    public layer: Layer;

    public subViews: View[] = [];

    public superView?: View;

    public useCache: boolean | string = true;

    public lock = false;

    private $observer: Observer;

    /**
     * 缓存的离屏上下文
     *
     * @private
     * @type {CanvasRenderingContext2D}
     * @memberof BaseView
     */
    private _cacheCanvasContext?: CanvasRenderingContext2D;

    public setSize(w: number, h: number) {
        this.layer.w = w;
        this.layer.h = h;
    }

    public rotate(deg: number) {
        this.layer.rotate(deg);
    }

    public scale(x: number, y: number) {
        this.layer.scale(x, y);
    }

    public translate(tx: number, ty: number) {
        this.layer.translate(tx, ty);
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     * @memberof View
     */
    public draw?(ctx: CanvasRenderingContext2D);

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
        view.layer.subLayers = undefined;
        view.destory();
    }

    public addView<T extends View>(view: T) {
        this.subViews.push(view);
        view.superView = this;
        view.layer.superLayer = this.layer;
    }

    public addViews<T extends View>(views: T[]) {
        views.forEach(v => this.addView(v));
    }

    public destory() {
        console.log('destory');
    }

    public hitTest(pos: [number, number]) {
        if (this.lock) return null;

        const [x, y] = pos;
        if (x >= this.x && x <= this.w + this.x && y >= this.y && y <= this.h + this.y) {
            if (this.subViews.length) {
                for (let index = 0; index < this.subViews.length; index += 1) {
                    const view = this.subViews[index].hitTest(pos);
                    if (view) return view;
                }

            }

            return this;
        }

        return null;
    }

    public render(ctx: CanvasRenderingContext2D) {

        if (!this.w || !this.h) return undefined;
        this.$observer.beginCollectDep();
        if (!this.cacheCanvasContext) {
            ctx.save();
            ctx.translate(this.x, this.y);
            this.layer.draw(ctx);
            if (this.draw) {
                this.draw(ctx);
            }
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.restore();
        } else {
            if (this.$observer.change) {
                this.cacheCanvasContext.save();
                this.cacheCanvasContext.canvas.width = Math.abs(this.w) + 2;
                this.cacheCanvasContext.canvas.height = Math.abs(this.h) + 2;
                this.cacheCanvasContext.translate(1.5, 1.5);
                this.layer.draw(this.cacheCanvasContext);
               this.cacheCanvasContext.restore();
                if (this.draw) {
                    this.draw(this.cacheCanvasContext);
                }
            }

            ctx.drawImage(this.cacheCanvasContext.canvas, this.x - 1, this.y - 1, this.w, this.h);
        }
        if (this.subViews.length) {
            this.subViews.forEach(v => v.render(ctx));
        }
        this.$observer.endCollectDep();
    }
}
