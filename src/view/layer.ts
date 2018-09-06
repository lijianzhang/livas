import BaseView, { attr } from './base';
import { IPostion } from '../types';
export { attr, computed } from './base';
import globalStore from '../store/global';
import { IViewEvent, IEventObj } from '../utils/event';

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
            return Number.MAX_SAFE_INTEGER - 100; // 保证在一些工具图形的下层
        }

        return this._zIndex;
    }

    set zIndex(value: number) {
        this._zIndex = value;
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
     * 判断点是否在该view上
     *
     * @param {IPostion} pos
     * @returns
     * @memberof BaseView
     */
    public pointInside(pos: IPostion) {


        const p = this.getPointWithView(pos);

        const [x, y, w, h] = this.frame;

        if (p.x >= x && p.x <= w + x && p.y >= y && p.y <= h + y) {
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

        if (this.parentView) {
            const p = this.parentView.getPointWithView(pos);
            x = p.x - this.parentView.x;
            y = p.y - this.parentView.y;
        }

        const angle = -Math.PI / 180 * this.rotate;

        const centerX = this.postion.x + this.size.w / 2;
        const centerY = this.postion.y + this.size.h / 2;

        return {
            x: (x  - centerX) * Math.cos(angle) - (y - centerY) * Math.sin(angle) + centerX,
            y: (x - centerX) * Math.sin(angle) + (y - centerY) * Math.cos(angle) + centerY
        };

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
            const w$ = Math.abs(w);
            const h$ = Math.abs(h);
            const angle = this.rotate * Math.PI / 180;
            const cos = Math.cos(angle);
            const cos$ = Math.abs(cos);
            const sin = Math.sin(angle);
            const sin$ = Math.abs(sin);

            const width = Math.floor((w$ * cos$ + h$ * sin$) * this.scale[0]);
            const hegiht = Math.floor((h$ * cos$ + w$ * sin$ + top + bottom) * this.scale[1]);

            console.log(width, hegiht, w$, h$);

            if (this._needForceUpdate) {
                this.cacheCanvasContext.canvas.width = width  + left + right + 2;
                this.cacheCanvasContext.canvas.height = hegiht  + left + right + 2;
                this.cacheCanvasContext.save();

                if (this.rotate) {
                    this.cacheCanvasContext.translate(
                        Math.floor((width + left + right + 2) / 2),
                        Math.floor((hegiht + left + right + 2) / 2)
                    );
                    this.cacheCanvasContext.rotate(angle);
                    this.cacheCanvasContext.translate((-w$ - left - right - 2) / 2, (-h$ - top - bottom - 2) / 2);
                }

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

            if (this.anchor[0] !== 0.5 || this.anchor[1] !== 0.5) {
                ctx.drawImage(this.cacheCanvasContext.canvas,
                    Math.ceil(x - left - 1) - (width - w$) / 2 + ((1 - this.anchor[1]) * h$ * sin),
                    Math.ceil(y - top - 1)  - (hegiht - h$) / 2 + ((1 - this.anchor[0]) * w$ * cos),
                    width,
                    hegiht
                );
            } else {
                ctx.drawImage(this.cacheCanvasContext.canvas,
                    Math.ceil(x - left - 1) - (width - w$) / 2,
                    Math.ceil(y - top - 1)  - (hegiht - h$) / 2,
                    width,
                    hegiht
                );
            }


        }
        this._needForceUpdate = false;
    }
}
