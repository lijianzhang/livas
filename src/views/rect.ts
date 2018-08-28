/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 22:52:21
 */
import BaseView from './base';
import ShapeModel from '../models/shape';


 export default class BrushView extends BaseView {

    public useCache = true;

    public data: ShapeModel;

    constructor() {
        super();
        this.data = new ShapeModel();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.data.opacity;

        const { x, y, w, h } = this.data.frame;

        if (this.data.lineWidth && this.data.strokeColor) {
            ctx.lineWidth = this.data.lineWidth;
            ctx.strokeStyle = this.data.strokeColor;
            ctx.lineCap = this.data.lineCap;
            ctx.lineJoin = this.data.lineJoin;
            ctx.strokeRect(x, y, w, h);
        }

        if (this.data.backgroundColor) {
            ctx.fillStyle = this.data.backgroundColor;
            ctx.fillRect(x, y, w, h);
        }

    }
 }
