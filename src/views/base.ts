import CachePool from '../utils/cache-pool';
import BaseModel from '../models/base';
import Canvas from '../canvas';
import { Observer, observable } from 'liob';

/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 14:18:55
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 18:48:10
 */

const cachePool = new CachePool(999);


export default abstract class BaseView {

    get data() {
        return this._data;
    }

    set data(value: BaseModel) {
        this._data = observable(value);
    }

    get cacheCanvasContext() {
        if (this._cacheCanvasContext) return this._cacheCanvasContext;
        const cache = cachePool.getCache();
        if (cache) {
            this._cacheCanvasContext = cache;

            return this._cacheCanvasContext;
        }

        return false;
    }


    /**
     * 父级View
     */
    public parent?: BaseView;

    /**
     * 是否使用缓存
     *
     * @abstract
     * @type {boolean}
     * @memberof BaseView
     */
    public abstract useCache: boolean;

    public rootCanvas!: Canvas;

    private $observer: any;

    /**
     * 判断元素需不需要重新渲染
     *
     * @private
     * @type {boolean}
     * @memberof BaseView
     */
    private changed: boolean = true;

    private _data!: BaseModel;

    /**
     * 缓存的离屏上下文
     *
     * @private
     * @type {CanvasRenderingContext2D}
     * @memberof BaseView
     */
    private _cacheCanvasContext?: CanvasRenderingContext2D;

    constructor() {
        this.$observer = new Observer(() => {
            this.changed = true;
            this.forceUpdate();
        }, `${this.constructor.name}.render()`);
    }

    public forceUpdate() {
        this.rootCanvas.forceUpdate();
    }

    /**
     * 各个子类需要实现的渲染方法
     *
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     * @returns {*}
     * @memberof BaseView
     */
    public abstract draw(ctx: CanvasRenderingContext2D): void;


    /**
     * 销毁图形时候触发
     *
     * @memberof BaseView
     */
    public destory() {
        if (this._cacheCanvasContext) {
            cachePool.freeCache(this._cacheCanvasContext);
            this._cacheCanvasContext = undefined;
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.$observer.beginCollectDep();
        ctx.save();
        this.privateRender(ctx);
        ctx.restore();
        this.changed = false;
        this.$observer.endCollectDep();

    }

    /**
     * 图形的一些基本渲染处理, 主要包括对缓存的处理
     * 子类不应该重写
     * @param {CanvasRenderingContext2D} ctx
     * @returns
     * @memberof BaseView
     */
    private privateRender(ctx: CanvasRenderingContext2D) {
        if (!this.rootCanvas || !this.data.visible || this.data.isEmpty) return null;
        if (!this.useCache) return this.draw(ctx);
        const { x, y, w, h } = this.data.frame;
        console.log('frame:', x, y, w, h);
        const { left, top, bottom, right } = this.data.padding;
        console.log('padding:', left, top, bottom, right);
        if (this.cacheCanvasContext) {
            if (this.changed) {
                this.cacheCanvasContext.canvas.width = Math.abs(w) + left + right + 1;
                this.cacheCanvasContext.canvas.height = Math.abs(h) + top + bottom + 1;
                this.cacheCanvasContext.clearRect(0, 0, w, h);
                this.cacheCanvasContext.save();
                this.cacheCanvasContext.translate(Math.ceil(- x + left) + 1 - (w > 0 ? 0 : w), Math.ceil(-y + top) + 1 - (h > 0 ? 0 : h));
                this.draw(this.cacheCanvasContext);
                this.cacheCanvasContext.restore();
            }
            ctx.drawImage(this.cacheCanvasContext.canvas,
                Math.ceil(x - left + (w > 0 ? 0 : w)) - 1,
                Math.ceil(y - top + (h > 0 ? 0 : h)) - 1
            );
        } else {
            this.draw(ctx);
        }
    }
}
