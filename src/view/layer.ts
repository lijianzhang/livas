import BaseView, { attr } from './base';
import CachePool from '../utils/cache-pool';
import { IPostion } from '../types';
export { attr, computed } from './base';
import globalStore from '../store/global';
import { IViewEvent, IEventObj } from '../utils/event';

// type MOUSE_EVENT = 'mousedown' | 'mouseenter' | 'mouseleave' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup';

const cachePool = new CachePool();


export default abstract class Layer extends BaseView implements IViewEvent {

    /**
     * 权重越高越上面
     *
     * @type {number}
     * @memberof BaseModel
     */
    @attr
    get zIndex() {
        if (globalStore.currentView && globalStore.currentView === this) {
            return Number.MAX_VALUE - 100; // 保证在一些工具图形的下层
        }

        return this._zIndex;
    }

    set zIndex(value: number) {
        this._zIndex = value;
    }

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

    /**
     * view相对于整个canvas的原点和宽高 [x, y, w, h];
     *
     * @readonly
     * @memberof Layer
     */
    get frame() {
        let {x, y} = this.postion;
        let { w, h } = this.size;
        if (w < 0) {
            x += this.size.w;
            w = -w;
        }

        if (h < 0) {
            y += this.size.h;
            h = -h;
        }

        return [x, y, w, h];
    }

    /**
     * view相对于整个canvas的x轴位置
     *
     * @readonly
     * @memberof Layer
     */
    get x() {
        let x = this.postion.x;
        if (this.size.w < 0) {
            x += this.size.w;
        }

        if (this.parentView) {
            return x + this.parentView.x;
        }

        return x;
    }

    /**
     * view相对于整个canvas的y轴位置
     *
     * @readonly
     * @memberof Layer
     */
    get y() {
        let y = this.postion.y;
        if (this.size.h < 0) {
            y += this.size.h;
        }

        if (this.parentView) {
            return y + this.parentView.y;
        }

        return y;
    }

    /**
     * 子层的view
     *
     * @type {Layer[]}
     * @memberof Layer
     */
    public subViews?: Layer[];

    /**
     * 父层view
     *
     * @type {Layer}
     * @memberof Layer
     */
    public parentView?: Layer;

    public mouseStatus = 'onMouseLeave';
    public void;

    /**
     * 是否使用缓存
     *
     * @protected
     * @abstract
     * @type {boolean}
     * @memberof Layer
     */
    protected abstract useCache: boolean;

    protected cachePool = cachePool;

    /**
     * 是否需要重新渲染
     *
     * @private
     * @memberof Layer
     */
    protected _needForceUpdate = true;

    /**
     * 各个子类需要实现的渲染方法
     * 注意点 在绘画过程中, 在draw中原点永远保持0,0 原点和变形都不要在函数内操作, 这些都在 @privateRender里封装
     *
     * @abstract
     * @param {CanvasRenderingContext2D} ctx
     * @returns {*}
     * @memberof BaseView
     */
    protected abstract;

    private _zIndex: number = this.id;

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


        const p = this.getPointWithView(pos);

        console.log('this.type', this.type, 'id:', this.id, 'p:', p, 'pos', pos, this.frame);

        const [, , w, h] = this.frame;

        if (p.x >= 0 && p.x <= w && p.y >= 0 && p.y <= h) {
            return true;
        }

        return false;
    }

    /**
     * 更新view
     *
     * @memberof Layer
     */
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

    /**
     * 渲染入口
     *
     * @param {CanvasRenderingContext2D} ctx
     * @memberof Layer
     */
    public render(ctx: CanvasRenderingContext2D) {
        this.$observer.beginCollectDep();
        if (this.parentView && this.visible && !this.isEmpty) {
            ctx.save();
            this.privateRender(ctx);
            ctx.restore();
        }
        this.$observer.endCollectDep();
    }



    public onMouseDown?(e: IEventObj): boolean;

    public onMouseMove?(e: IEventObj);

    public onMouseUp?(e: IEventObj): boolean;

    public onMouseEnter?(e: IEventObj);

    public onMouseDrag?(e: IEventObj);

    public onMouseLeave?();

    public getPointWithView(pos: IPostion) {
        let x = pos.x;
        let y = pos.y;
        // const diffX = 0;
        // const diffY = 0;
        // const rotate = this.rotate;
        // if (this.parentView) {
        //     const p = this.parentView.getPointWithView(pos);
        //     x = p.x;
        //     y = p.y;
        //     // x -= this.parentView.postion.x;
        //     // y -= this.parentView.postion.y;
        //     // diffX = this.parentView.postion.x;
        //     // diffY = this.parentView.postion.y;
        //     // rotate += this.parentView.rotate;
        //     console.log(`在${this.parentView.type}${this.parentView.id}坐标系里的xy轴`, x, y);
        // }

        const angle = Math.PI / 180 * this.rotate;

        console.log(angle);

        if (angle === 0) {
            return {
                x: x - this.x,
                y: y - this.y
            };
        }

        x -= this.x;
        y -= this.y;

        console.log(x, y);
        console.log('Math.tan(angle)', Math.tan(angle), 'Math.sin(angle)', Math.sin(angle), 'Math.cos(angle)', Math.cos(angle));
        const x1 = (x - y * Math.tan(angle)) * Math.cos(angle);
        const y1 = y / Math.cos(angle) + x1 * Math.tan(angle);

        console.log(x1, y1);

        return {
            x: x1,
            y: y1
        };

        // return {
        //     x: (x  - centerX) * Math.cos(angle) - (y - centerY) * Math.sin(angle) + centerX - this.postion.x,
        //     y: (x - centerX) * Math.sin(angle) + (y - centerY) * Math.cos(angle) + centerY - this.postion.y
        // };

    }


    protected abstract draw(ctx: CanvasRenderingContext2D);
    /**
     * 图形的一些基本渲染处理, 主要包括对缓存的处理
     * 子类不应该重写
     * @param {CanvasRenderingContext2D} ctx
     * @returns
     * @memberof BaseView
     */
    protected privateRender(ctx: CanvasRenderingContext2D) {
        // const [x1, y1, w , h] = this.frame;
        const { left, top, bottom, right } = this.padding || { left: 0, right: 0, top: 0, bottom: 0 };
        const [x , y ] = this.frame;
        const { w, h } = this.size;

        if (!this.cacheCanvasContext) {
            ctx.save();
            ctx.translate(Math.ceil(x - (w > 0 ? 0 : w)), Math.ceil(y + (h > 0 ? 0 : h)));
            this.draw(ctx);
            ctx.restore();
        } else {
            const ww = Math.abs(w);
            const hh = Math.abs(h);
            const angle = this.rotate * Math.PI / 180;
            const width = Math.ceil(
                (Math.abs(ww * Math.abs(Math.cos(angle)) + hh * Math.abs(Math.sin(angle))) + left + right + 2) * this.scale[0]
            );
            const hegiht = Math.ceil(
                (Math.abs(hh * Math.abs(Math.cos(angle)) + ww * Math.abs(Math.sin(angle))) + top + bottom + 2) * this.scale[1]
            );
            if (this._needForceUpdate) {
                this.cacheCanvasContext.canvas.width = width;
                this.cacheCanvasContext.canvas.height = hegiht;
                this.cacheCanvasContext.save();




                this.cacheCanvasContext.translate(width / 2, hegiht / 2);
                this.cacheCanvasContext.rotate(angle);
                this.cacheCanvasContext.translate(-ww / 2, -hh / 2);

                if (w < 0 || h < 0) {
                    this.cacheCanvasContext.scale(w < 0 ? -1 : 1, h < 0 ? -1 : 1);
                    this.cacheCanvasContext.translate(w < 0 ? w : 0, h < 0 ? h : 0);
                }



                this.cacheCanvasContext.transform(
                    this.scale[0],
                    this.skew[0],
                    this.skew[1],
                    this.scale[1],
                    (left + 1),
                    (top + 1)
                );



                this.draw(this.cacheCanvasContext);
                this.cacheCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
                this.cacheCanvasContext.restore();
            }

            ctx.drawImage(this.cacheCanvasContext.canvas,
                Math.ceil(x - left - 1) - (width - ww) / 2,
                Math.ceil(y - top - 1)  - (hegiht - hh) / 2,
                width,
                hegiht
            );

        }
        this._needForceUpdate = false;
    }
}
