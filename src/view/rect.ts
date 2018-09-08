/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-04 22:26:28
 */
import LayerView, { attr } from './layer';
import { IPostion, ISize } from '../types';

 export default class RectView extends LayerView {

    @attr
    public postion: IPostion = { x: 0, y: 0 };

    @attr
    public size: ISize = { w: 0, h: 0 };

    /**
     * 填充的颜色
     *
     * @type {string}
     * @memberof ShapeModel
     */
    @attr
    public backgroundColor?: string;

    get padding(): [number, number, number, number] {
        const w = Math.ceil(this.lineWidth / 2);

        return [w, w, w, w];
    }

    public type = 'rect';

    public useCache = true;


    public draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;

        const [, , w, h] = this.frame;

        if (this.lineWidth && this.color) {
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.color;
            ctx.lineCap = this.lineCap;
            ctx.lineJoin = this.lineJoin;
            ctx.strokeRect(0, 0, w, h);
        }

        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, w, h);
        }

    }
 }
