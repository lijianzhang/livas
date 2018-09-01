import BaseView, { attr } from './base';
import CachePool from '../utils/cache-pool';
import { IPostion } from '../types';
export { attr, computed } from './base';

type MOUSE_EVENT = 'mousedown' | 'mouseenter' | 'mouseleave' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup';

const cachePool = new CachePool();


export default abstract class Layer extends BaseView  {

    get cacheCanvasContext() {
        if (this._cacheCanvasContext) return this._cacheCanvasContext;
        if (!this.useCache) return false;
        const cache = cachePool.getCache();
        if (cache) {
            this._cacheCanvasContext = cache;

            return this._cacheCanvasContext;
        }

        return false;
    }

    get frame() {
        return [this.x, this.y, this.size.w, this.size.h];
    }

    get x() {
        if (this.parentView) {
            return this.postion.x + this.parentView.x;
        }

        return this.postion.x;
    }

    get y() {
        if (this.parentView) {
            return this.postion.y + this.parentView.y;
        }

        return this.postion.y;
    }

    @attr
    public subViews?: Layer[];

    public parentView?: Layer;

    protected abstract useCache: boolean;

    protected cachePool = cachePool;

    /**
     * 是否需要重新渲染
     *
     * @private
     * @memberof Layer
     */
    private _needForceUpdate = true;

    /**
     * 缓存的离屏上下文
     *
     * @private
     * @type {CanvasRenderingContext2D}
     * @memberof BaseView
     */
    private _cacheCanvasContext?: CanvasRenderingContext2D;

    /**
     * 判断点是否在该view上
     *
     * @param {IPostion} pos
     * @returns
     * @memberof BaseView
     */
    public pointInside(pos: IPostion) {
        if (this.x <= pos.x && pos.x <= this.x + this.size.w && this.y <= pos.y && pos.y <= this.y + this.size.h) {
            return true;
        }

        return false;
    }

    public forceUpdate() {
        if (this.parentView) {
            this._needForceUpdate = true;
            this.parentView.forceUpdate();
        }
    }

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
        if (this.parentView && this.visible && !this.isEmpty) {
            ctx.save();
            this.privateRender(ctx);
            ctx.restore();
        }
        this.$observer.endCollectDep();
    }



    public onMouseDown?(e: MouseEvent, pos: IPostion): boolean;

    public onMouseMove?(e: MouseEvent, pos: IPostion): boolean;

    public onMouseUp?(e: MouseEvent, pos: IPostion): boolean;


    /**
     * 各个子类需要实现的渲染方法
     *
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     * @returns {*}
     * @memberof BaseView
     */
    protected abstract draw(ctx: CanvasRenderingContext2D): void;

    /**
     * 图形的一些基本渲染处理, 主要包括对缓存的处理
     * 子类不应该重写
     * @param {CanvasRenderingContext2D} ctx
     * @returns
     * @memberof BaseView
     */
    protected privateRender(ctx: CanvasRenderingContext2D) {
        const [x1, y1, w , h] = this.frame;
        const { left, top, bottom, right } = this.padding || { left: 0, right: 0, top: 0, bottom: 0 };
        const { x , y } = this.postion;
        if (!this.cacheCanvasContext) {
            ctx.save();

            ctx.translate(Math.ceil(x1 - x + (w > 0 ? 0 : w)), Math.ceil(y1 - y + (h > 0 ? 0 : h)));
            this.draw(ctx);
            ctx.restore();
        } else {
            if (this._needForceUpdate) {
                this.cacheCanvasContext.canvas.width = Math.abs(w) + left + right + 2;
                this.cacheCanvasContext.canvas.height = Math.abs(h) + top + bottom + 2;
                this.cacheCanvasContext.save();
                this.cacheCanvasContext.translate(Math.ceil(-x + left) + 1 - (w > 0 ? 0 : w), Math.ceil(-y + top) + 1 - (h > 0 ? 0 : h));
                this.draw(this.cacheCanvasContext);
                this.cacheCanvasContext.restore();
            }
            ctx.drawImage(this.cacheCanvasContext.canvas,
                Math.ceil(x1 - left + (w > 0 ? 0 : w)) - 1,
                Math.ceil(y1 - top + (h > 0 ? 0 : h)) - 1
            );
        }
        this._needForceUpdate = false;
    }
}
