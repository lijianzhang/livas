import Base from './base';
import ShapeModel from '../models/shape';


export default class Gridding extends Base {

    public data = new ShapeModel();

    public useCache = true;

    constructor() {
        super();
        this.data.strokeColor = '#000';
        this.data.lineWidth = 1;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const stepX = 10;
        const stepY = 10;
        ctx.strokeStyle = this.data.strokeColor;
        ctx.lineWidth = this.data.lineWidth;

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
