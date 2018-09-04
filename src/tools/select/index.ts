import BaseView from '../../views/base';
import Model from './model';
import GlobalStore from '../../models/global-store';

/*
 * @Author: lijianzhang
 * @Date: 2018-08-30 20:50:27
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-04 09:38:32
 */

 export default class Select extends BaseView {

    get point() {
        if (!this._cachePonit) {
            const cache = this.cachePool.getCache();
            this._cachePonit = cache;
            cache.lineWidth = 1.5;
            cache.canvas.width = 11;
            cache.canvas.height = 11;
            cache.fillStyle = '#fff';
            cache.strokeStyle = '#666';
            cache.fillRect(0, 0, 11, 11);
            cache.strokeRect(0, 0, 11, 11);
        }
        return this._cachePonit;
    }

    public static type = 'tool-select';

    constructor(store: GlobalStore) {
        super();
        this.data = new Model(store);
        this.store = store;
    }

    public useCache = true;

    public data: Model;

    public store: GlobalStore;

    public _zIndex = Number.MAX_VALUE;

    private _cachePonit?: CanvasRenderingContext2D;

    public draw(ctx: CanvasRenderingContext2D) {
        const currentView = this.store.currentView;
        if (currentView)  {
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#fff';
            const { x, y, w, h } = this.data.frame;
            // ctx.scale(2, 2);
            ctx.strokeRect(x, y, w, h);
            ctx.strokeStyle = '#000';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(x, y, w, h);
            ctx.drawImage(this.point.canvas, x - 6, y - 6);
        }
    }
 }
