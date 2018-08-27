import Base from './base';
import BsaeModel from '../models/base';
import Observer from '../decorators/obsever';

@Observer
export default class Gridding extends Base {

    public data = new BsaeModel();

    public draw(ctx: CanvasRenderingContext2D) {
        const stepX = 10;
        const stepY = 10;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        for (let i = stepX + 1.5; i < this.data.size.w; i += stepX) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.data.size.h);
            ctx.stroke();
        }

        for (let i = stepY + 1.5; i < this.data.size.h; i += stepY) {
            ctx.moveTo(0, i);
            ctx.lineTo(this.data.size.w, i);
            ctx.stroke();
        }
    }
}
