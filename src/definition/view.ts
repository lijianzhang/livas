/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 01:09:48
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 21:38:54
 */

 declare namespace Livas {
     export interface IView extends IResponder {

        name: string;

        id: number;

        /**
         * 画布
         *
         * @type {IBaseLayer}
         * @memberof IView
         */
        layer: IBaseLayer;

        /**
         * 如果使用了缓存, 指定缓存的key
         *
         * @type {(string | symbol)}
         * @memberof IBaseLayer
         */
        cacheKey?: string | symbol | number;

        superView?: IView;

        backgroundColor: string;

        subViews: IView[];

        frame: Livas.gemo.IRect;

        bounds: Livas.gemo.IRect;

        transform: Livas.gemo.IMatrix;

        /**
         * 是否需要重新渲染
         *
         * @type {boolean}
         * @memberof IView
         */
        readonly hasChange: boolean;

        addSubView(view: IView);

        removeSubView(view: IView);

        render(ctx: IReanderContenxt);

        /**
         * 碰撞测试
         *
         * @param {gemo.IPoint} point
         * @returns {boolean}
         * @memberof IView
         */
        hitTest(point: gemo.IPoint): IView | null;
     }
 }
