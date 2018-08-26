import Base from './base';
import LineModel from '../models/line';
import Observer from '../decorators/obsever';
import { IPostion } from '../types/postion';

@Observer
export default class Line extends Base {
    constructor() {
        super();
    }

    data = new LineModel();

    midPointBtw(p1: IPostion, p2: IPostion) {
        return {
          x: p1.x + (p2.x - p1.x) / 2,
          y: p1.y + (p2.y - p1.y) / 2
        };
    }

    getPrecisePosition(postion: IPostion) {
        if (this.data.lineWidth % 2 === 0) {
            return postion;
        }
        return {
            x: postion.x - 0.5,
            y: postion.y - 0.5,
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.data.pos.length < 2) return;
        ctx.lineWidth = this.data.lineWidth || .5;
        ctx.strokeStyle = this.data.strokeColor;
        ctx.lineCap = this.data.lineCap;
        ctx.lineJoin = this.data.lineJoin;
        ctx.globalAlpha = this.data.opacity;
        ctx.beginPath();
        let p1 = this.data.pos[0];
        let p2 = this.data.pos[1];
        const { x, y } = this.getPrecisePosition(p1);
        ctx.moveTo(x, y);
        for (let index = 1; index < this.data.pos.length; index++) {
            const { x, y } = this.getPrecisePosition(p1);
            const minPoint = this.midPointBtw(p1, p2)
            ctx.quadraticCurveTo(x, y, minPoint.x, minPoint.y)
            p1 = p2;
            p2 = this.data.pos[index + 1];
        }
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    }
}