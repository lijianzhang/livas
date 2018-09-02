/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-02 07:53:00
 */
import BrushView from './brush';
import { IPostion } from '../types';

 export default class LineView extends BrushView {

    public static type = 'line';

    public useCache = true;


    get startPostion() {
        return this.postions[0];
    }

    set startPostion(value: IPostion) {
        this.postions[0] = value;
    }

    get endPostion() {
        return this.postions[1];
    }

    set endPostion(value: IPostion) {
        this.postions[1] = value;
    }


    public draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.lineWidth || 0.5;
        ctx.strokeStyle = this.color;
        ctx.lineCap = this.lineCap;
        ctx.lineJoin = this.lineJoin;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();

        ctx.moveTo(this.startPostion.x, this.startPostion.y);
        ctx.lineTo(this.endPostion.x, this.endPostion.y);
        ctx.stroke();
    }
 }
