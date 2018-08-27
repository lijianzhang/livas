import Base from './base';
import LineModel from '../models/line';
import Observer from '../decorators/obsever';
@Observer
export default class Line extends Base {

    public data = new LineModel();
    constructor() {
        super();
    }


    get useCache() {
        return true;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.data.lineWidth || 0.5;
        ctx.strokeStyle = this.data.strokeColor;
        ctx.lineCap = this.data.lineCap;
        ctx.lineJoin = this.data.lineJoin;
        ctx.globalAlpha = this.data.opacity;
        ctx.beginPath();

        let p1 = this.data.pos[0];
        let p2 = this.data.pos[1];
        const { x, y } = this.getPrecisePosition(p1);
        ctx.moveTo(x, y);
        for (let index = 1; index < this.data.pos.length; index += 1) {
            const { x, y } = this.getPrecisePosition(p1);
            const minPoint = this.midPointBtw(p1, p2);
            ctx.quadraticCurveTo(x, y, minPoint.x, minPoint.y);
            p1 = p2;
            p2 = this.data.pos[index + 1];
        }
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }
}
