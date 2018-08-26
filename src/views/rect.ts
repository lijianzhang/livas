import RectModel from '../models/rect';
import Base from './base';
import Observer from '../decorators/obsever';

@Observer
export default class Rect extends Base {
    constructor() {
        super();
        this.data = new RectModel();
    }

    data: RectModel;

    draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.data.lineWidth || 27;
        ctx.strokeStyle = 'rgb(1, 161, 255)';
        ctx.lineCap = this.data.lineCap || 'normal';
        ctx.globalAlpha = this.data.opacity;
        ctx.strokeRect(this.data.postion.x, this.data.postion.y, this.data.size.w, this.data.size.h);
    }
}
