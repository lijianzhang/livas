/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-02 14:50:10
 */
import LayerView, { attr } from './layer';
import { IPostion } from '../types';

 export default class CircleView extends LayerView {

    public type = 'circle';

    @attr
    public postion: IPostion = { x: 0, y: 0 };

    @attr
    public r: number = 0;

    get size() {
        return { w: this.r * 2, h: this.r * 2 };
    }

    /**
     * 填充的颜色
     *
     * @type {string}
     * @memberof ShapeModel
     */
    @attr
    public backgroundColor?: string;

    @attr
    public rPadding: number = 0;

    public useCache = true;


    public draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;

        const {x, y} = this.postion;
        ctx.shadowColor = 'rgba(0,0,0,.15)';
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 1;
        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(x + this.r, y + this.r, this.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            ctx.beginPath();
            ctx.arc(x + this.r, y + this.r, this.r - this.rPadding, 0, Math.PI * 2);
            ctx.fill();
        }

    }
 }
