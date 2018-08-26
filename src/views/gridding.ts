import Base from './base';
import BsaeModel from '../models/base';
import Observer from '../decorators/obsever';

@Observer
export default class Gridding extends Base {

    data = new BsaeModel();

    get cache() {
        if (!this.ctx) {
            const canvas = document.createElement('canvas');
            canvas.width = this.data.size.w;
            canvas.height = this.data.size.h;
            this.ctx = canvas.getContext('2d')!;
            this.drawGridding(this.ctx);
        } else if (this.changed) {
            this.drawGridding(this.ctx);
            this.changed = false;
        }

        return this.ctx.canvas;
    }

    ctx!: CanvasRenderingContext2D;

    drawGridding(ctx: CanvasRenderingContext2D) {
        const stepX = 10;
        const stepY = 10;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;

        for (var i = stepX + 1.5; i < this.data.size.w; i += stepX) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.data.size.h);
            ctx.stroke();
        }

        for (var i = stepY + 1.5; i < this.data.size.h; i += stepY) {
            ctx.moveTo(0, i);
            ctx.lineTo(this.data.size.w, i);
            ctx.stroke(); 
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.cache, this.data.postion.x, this.data.postion.y);
    }
}