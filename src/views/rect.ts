/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 18:47:40
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

        console.log(x, y, w, h);

        if (this.data.lineWidth) {
            ctx.lineWidth = this.data.lineWidth;
            ctx.strokeStyle = this.data.strokeColor;
            ctx.lineCap = this.data.lineCap;
            ctx.lineJoin = this.data.lineJoin;
            ctx.strokeRect(x, y, w, h);
        }


        ctx.fillStyle = this.data.fillColor;
        ctx.fillRect(x, y, w, h);
    }
 }
