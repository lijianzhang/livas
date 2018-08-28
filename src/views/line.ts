/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 17:00:20
 */
import BaseView from './base';
import LineModel from '../models/line';


 export default class BrushView extends BaseView {

    public useCache = true;

    public data: LineModel;

    constructor() {
        super();
        this.data = new LineModel();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.data.lineWidth || 0.5;
        ctx.strokeStyle = this.data.strokeColor;
        ctx.lineCap = this.data.lineCap;
        ctx.lineJoin = this.data.lineJoin;
        ctx.globalAlpha = this.data.opacity;
        ctx.beginPath();

        ctx.moveTo(this.data.startPostion.x, this.data.startPostion.y);
        ctx.lineTo(this.data.endPostion.x, this.data.endPostion.y);
        ctx.stroke();
    }
 }
