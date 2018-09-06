import Base from './layer';


export default class Gridding extends Base {

    constructor() {
        super();
        this.color = 'lightgray';
        this.lineWidth = 1;
    }

    public postion = { x: 0, y: 0 };

    public size = { w: 0, h: 0 };

    public type = 'gridding';

    public useCache = true;

    public draw(ctx: CanvasRenderingContext2D) {
        const stepX = 10;
        const stepY = 10;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;

        for (let i = stepX + 1.5; i < this.size.w; i += stepX) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.size.h);
            ctx.stroke();
        }

        for (let i = stepY + 1.5; i < this.size.h; i += stepY) {
            ctx.moveTo(0, i);
            ctx.lineTo(this.size.w, i);
            ctx.stroke();
        }
    }
}
