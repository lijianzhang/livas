/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 00:28:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 21:35:20
 */
declare namespace Livas {

    export enum AlignmenMode {
        left = 'left',
        center = 'center',
        right = 'right'
    }

    export interface ILayerDelegate {
        draw(layer: IBaseLayer, ctx: IReanderContenxt);
    }
    /**
     * 基本画布属性
     *
     * @export
     * @interface IBaseLayer
     */
    export interface IBaseLayer {

        id: number;

        delegate?: ILayerDelegate;

        /**
         * 透明度
         *
         * @type {number}
         * @memberof IBaseLayer
         */
        opacity?: number;

        /**
         * 经过变形后, 相对于 superLayer 的 rectangle
         *
         * @type {Livas.IRect}
         * @memberof IBaseLayer
         */
        frame: gemo.IRect;

        /**
         * 相对于自身的 rectangle(不包含变形)
         *
         * @type {Livas.IRect}
         * @memberof IBaseLayer
         */
        bounds: gemo.IRect;

        /**
         * 相对于 superLayer 的坐标
         *
         * @type {Livas.IPoint}
         * @memberof IBaseLayer
         */
        position: gemo.IPoint;

        /**
         * 画布尺寸
         *
         * @type {Livas.ISize}
         * @memberof IBaseLayer
         */
        size: gemo.ISize;

        /**
         * 锚点或旋转点
         *
         * @type {Livas.IPoint}
         * @memberof IBaseLayer
         */
        anchorPoint: gemo.IPoint;


        /**
         *
         *
         * @type {IMatrix}
         * @memberof IBaseLayer
         */
        transform: gemo.IMatrix;

        /**
         * 边框宽度
         *
         * @type {number}
         * @memberof IBaseLayer
         */
        borderWidth?: number;

        /**
         * 边框圆角弧度
         *
         * @type {number}
         * @memberof IBaseLayer
         */
        borderRadius?: number;

        /**
         * 边框颜色
         *
         * @type {string}
         * @memberof IBaseLayer
         */
        borderColor?: string;

        /**
         * 背景色
         *
         * @type {string}
         * @memberof IBaseLayer
         */
        backgroundColor?: string;


        zIndex?: number;

        /**
         * 父层的layer
         *
         * @type {IBaseLayer}
         * @memberof IBaseLayer
         */
        superLayer?: IBaseLayer;

        /**
         * 子层的layer
         *
         * @type {IBaseLayer[]}
         * @memberof IBaseLayer
         */
        subLayers: IBaseLayer[];

        /**
         * 获取对象形变后外切矩形
         *
         * @type {gemo.IRect}
         * @memberof IBaseLayer
         */
        readonly drawRect: gemo.IRect;

        /**
         * 添加子层layer
         *
         * @param {IBaseLayer} layer
         * @memberof IBaseLayer
         */
        addSubLayer(layer: IBaseLayer);

        /**
         * 删除子层layer
         *
         * @param {IBaseLayer} layer
         * @memberof IBaseLayer
         */

        /**
         * 绘画
         *
         * @param {Livas.IReanderContenxt} context
         * @memberof IBaseLayer
         */
        draw(context: IReanderContenxt);
    }

    /**
     * 文本画布属性
     *
     * @export
     * @interface ITextLater
     * @extends {IBaseLayer}
     */
    export interface ITextLater extends IBaseLayer {
        fontSize: number;
        lineHeight?: number;
        fontFamily?: number;
        align?: AlignmenMode;

        color: string;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;

        strokeColor?: string;
        stroke?: number;

        text: string;
        lines: number;
    }

    /**
     * 图片画布元素
     *
     * @export
     * @interface IImageLayer
     * @extends {IBaseLayer}
     */
    export interface IImageLayer extends IBaseLayer {
        src: string;
    }

    /**
     * 多边形画布属性
     *
     * @export
     * @interface IPolygonLayer
     * @extends {IBaseLayer}
     */
    export interface IPolygonLayer extends IBaseLayer {
        path: string;
    }

    /**
     * 多线段画布属性
     *
     * @export
     * @interface IPolylineLayer
     * @extends {IBaseLayer}
     */
    export interface IPolylineLayer extends IBaseLayer {
        path: string;
    }
}
