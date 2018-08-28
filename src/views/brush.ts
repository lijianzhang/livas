/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 17:10:02
 */
import BaseView from './base';
import BrushModel from '../models/brush';


 export default class BrushView extends BaseView {

    public useCache = true;

    public data: BrushModel;

    constructor() {
        super();
        this.data = new BrushModel();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.data.lineWidth || 0.5;
        ctx.strokeStyle = this.data.strokeColor;
        ctx.lineCap = this.data.lineCap;
        ctx.lineJoin = this.data.lineJoin;
        ctx.globalAlpha = this.data.opacity;
        ctx.beginPath();

        let p1 = this.data.postions[0];
        let p2 = this.data.postions[1];
        const { x, y } = p1;
        ctx.moveTo(x, y);
        for (let index = 1; index < this.data.postions.length; index += 1) {
            const { x, y } = p1;
            const minPoint = this.data.midPointBtw(p1, p2);
            ctx.quadraticCurveTo(x, y, minPoint.x, minPoint.y);
            p1 = p2;
            p2 = this.data.postions[index + 1];
        }
        ctx.stroke();
    }
 }
