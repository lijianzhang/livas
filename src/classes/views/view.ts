import { Observer, observable, computed } from 'liob';
import Layer from '../layers/layer';
import Rect from '../rect';
import Point, { IPoint } from '../point';
import { IRect } from '../../types';
import CachePool from '../../utils/cache-pool';
import Responder from './responder';
import globalStore from '../../store/global';

let id = 0;
const cachePool = new CachePool();
export default class View extends Responder {

    /**
     * delegate layer frame
     *
     * @memberof View
     */
    get frame() {
        return this.layer.frame;
    }


    /**
     * delegate layer frame
     *
     * @memberof View
     */
    set frame(rect: IRect) {
        this.layer.frame = rect;
    }

    /**
     * delegate layer backgroundColor
     *
     * @memberof View
     */
    get backgroundColor() {
        return this.layer.backgroundColor;
    }

    /**
     * delegate layer backgroundColor
     *
     * @memberof View
     */
    set backgroundColor(color: string) {
        this.layer.backgroundColor = color;
    }

    /**
     * 离屏canvas 用于缓存, 加速渲染
     *
     * @readonly
     * @memberof View
     */
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

    get zIndex() {
        if (globalStore.currentView && globalStore.currentView === this) {
            return Number.MAX_SAFE_INTEGER - 100; // 保证在一些工具图形的下层
        }

        return this._zIndex;
    }

    set zIndex(value: number) {
        this._zIndex = value;
    }

    @computed
    get sortSubViews() {
        return [...this.subViews].sort((a, b) => {
            return a.zIndex - b.zIndex;
        });
    }

    constructor(rect: IRect = Rect.zero()) {
        super();
        this.layer.frame = rect;
        this.layer.delegate = this;
        id += 1;
        this.id = id;
        this.$observer = new Observer(() => {
            this.forceUpdate();
        }, `${this.constructor.name}.render()`);
    }

    /**
     * view的唯一标识
     *
     * @type {number}
     * @memberof View
     */
    public id: number;

    /**
     * 每个view都包含一个layer绘制图形
     *
     * @memberof View
     */
    public layer = new Layer();

    /**
     * 上层view
     *
     * @type {View}
     * @memberof View
     */
    public superView?: View;

    /**
     * 下层views
     *
     * @type {View[]}
     * @memberof View
     */
    @observable
    public subViews: View[] = [];

    /**
     * 是否启动缓存,默认 true
     *
     * @memberof View
     */
    public useCache = true;

    private _zIndex: number = this.id;

    private _cacheContext?: CanvasRenderingContext2D;

    private $observer: Observer;

    /**
     * 从上级 view 中删除本身
     *
     * @memberof View
     */
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

    /**
     * 碰撞检测
     *
     * @param {IPoint} pos
     * @returns
     * @memberof View
     */
    public hitTest(pos: IPoint): View | null {
        if (this.layer.hitTest(pos)) {
            if (this.subViews) {
                const p = Point.offsetBy(this.layer.getPointWithView(pos),
                    this.layer.position.x,
                    this.layer.position.y
                );
                for (let index = this.sortSubViews.length - 1; index >= 0; index -= 1) {
                    const view = this.sortSubViews[index].hitTest(p);
                    if (view) return view;
                }
            }

            return this;
        }

        return null;
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

    public renderSubLayers(ctx: CanvasRenderingContext2D) {
        if (this.subViews.length) {
            this.subViews.forEach(v => v.render(ctx));
        }
    }

    public render(ctx: CanvasRenderingContext2D) {
        this.$observer.beginCollectDep();
        const { w, h, x , y } = this.layer.frame;

        if (this.$observer.change) {
            if (this.cacheContext) {
                this.cacheContext.canvas.height = this.frame.h + 2;
                this.cacheContext.canvas.width = this.frame.w + 2;
                this.layer.render(this.cacheContext);
            }

        }

        if (this.cacheContext) {
            ctx.drawImage(
                this.cacheContext.canvas,
                x - 1, y - 1, w, h
            );
        } else {
            ctx.translate(x, y);
            this.layer.render(ctx);
        }

        this.$observer.endCollectDep();
    }
}
