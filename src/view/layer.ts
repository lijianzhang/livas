import BaseView, { attr } from './base';
import { IPostion } from '../types';
export { attr, computed } from './base';
import globalStore from '../store/global';
import { IViewEvent, IEventObj } from '../utils/event';
import { computed } from 'liob';

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
     * view相对于父级view的原点和宽高 [x, y, w, h];
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

    @computed
    get sortSubViews() {
        return [...this.subViews].sort((a, b) => {
            return a.zIndex - b.zIndex;
        });
    }

    /**
     * 子层的view
     *
     * @type {Layer[]}
     * @memberof Layer
     */
    @attr
    public subViews: Layer[] = [];

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

    public removeView<T extends Layer>(el: T) {
        const index = this.subViews.findIndex(e => e === el);
        this.subViews.splice(index, 1);
        el.parentView = undefined;
        el.destory();
    }

    public addView<T extends Layer>(el: T) {
        this.subViews.push(el);
        el.parentView = this;
    }

    public addViews<T extends Layer>(els: T[]) {
        els.forEach(el => this.addView(el));
    }



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
        if (this.visible && !this.isEmpty) {
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

    get canvasSize() {
        let [, , w, h ] = this.frame;
        const [top, left , bottom, right] = this.padding || [0, 0, 0, 0];
        const rotate = this.rotate % 360;
        const angle = rotate * Math.PI / 180;
        w = w + left + right;
        h = h + bottom + top;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return [ Math.floor((w * cos + h * sin)), Math.floor((h * cos + w * sin))];
    }

    /**
     * 实际在画布上的frame
     *
     * @readonly
     * @memberof Layer
     */
    get drawFrame() {
        const [x , y , w, h ] = this.frame;
        const [top, left , bottom, right] = this.padding || [0, 0, 0, 0];

        if (this.rotate === 0) {
            return [x, y, w + right + left, h + top + bottom];
        }

        const w$ = Math.abs(w) + left + right;
        const h$ = Math.abs(h) + bottom + top;
        const rotate = this.rotate % 360;
        const angle = rotate * Math.PI / 180;
        const cos = Math.cos(angle);
        const cos$ = Math.abs(cos);
        const sin = Math.sin(angle);
        const sin$ = Math.abs(sin);

        const width = Math.floor((w$ * cos$ + h$ * sin$));
        const hegiht = Math.floor((h$ * cos$ + w$ * sin$));
        const differX = w$ * (this.anchor[0] - 0.5) * cos - h$ * (this.anchor[1] - 0.5) * sin - w$ * (this.anchor[0])  + width / 2;

        const differY = h$ * (this.anchor[1] - 0.5) * cos + w$ * (this.anchor[0] - 0.5) * sin - h$ * (this.anchor[1])  + hegiht / 2;

        return [x - differX, y - differY, width, hegiht];
    }

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
        const [top, left , bottom, right] = this.padding || [0, 0, 0, 0];
        const [x , y, w, h ] = this.frame;

        if (!this.cacheCanvasContext) {
            ctx.save();
            ctx.translate(Math.ceil(x - (w > 0 ? 0 : w)), Math.ceil(y + (h > 0 ? 0 : h)));
            this.innerDraw(ctx);
            ctx.restore();
        } else {
            // 变量 $ 结尾表示绝对值
            const w$ = Math.abs(w) + left + right;
            const h$ = Math.abs(h) + bottom + top;
            const rotate = this.rotate % 360;
            const angle = rotate * Math.PI / 180;

            const [rx, ry , rw, rh] = this.drawFrame;

            if (this._needForceUpdate) {
                this.cacheCanvasContext.canvas.width = rw + 2;
                this.cacheCanvasContext.canvas.height = rh + 2;
                this.cacheCanvasContext.save();

                if (this.rotate) { // 减少不必要的计算
                    this.cacheCanvasContext.translate(
                        Math.floor((rw + 2) / 2),
                        Math.floor((rh + 2) / 2)
                    );
                    this.cacheCanvasContext.rotate(angle);
                    this.cacheCanvasContext.translate((-w$ - 2) / 2, (-h$ - 2) / 2);
                }

                if (w < 0 || h < 0) { // 宽高为负数 的时候翻转图形
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

                this.innerDraw(this.cacheCanvasContext);
                this.cacheCanvasContext.setTransform(1, 0, 0, 1, 0, 0);
                this.cacheCanvasContext.restore();
            }

            ctx.drawImage(this.cacheCanvasContext.canvas,
                Math.ceil(rx  - left - 1),
                Math.ceil(ry  - top - 1),
                rw,
                rh
            );
        }
        this._needForceUpdate = false;
    }

    private innerDraw(ctx: CanvasRenderingContext2D) {
        this.draw(ctx);
        if (this.subViews.length) {
            for (const view of this.sortSubViews) {
                view.render(ctx);
            }
        }
    }
}
