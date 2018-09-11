import Rect from './rect';
import { ISize } from './size';
import Matrix from './matrix';
import { IRect } from '../types';

export default class GraphicsContext {

    get backgroundColor() {
        return this.ctx.fillStyle as string;
    }

    set backgroundColor(value: string) {
        this.ctx.fillStyle = value;
    }
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public ctx: CanvasRenderingContext2D;

    public fillRect(rect: IRect, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    public strokeRect(rect: IRect, color: string, lineWidth: number) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeRect(...Rect.toArray(rect));
    }

    public setSize(size: ISize) {
        this.ctx.canvas.width = size.w;
        this.ctx.canvas.height = size.h;
    }

    public drawImage(img: any, rect: IRect) {
        this.ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);
    }

    /**
     * translate
     */
    public translate(x: number, y: number) {
        this.ctx.translate(x, y);
    }

    public resetTranform() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    public transform(m: Matrix) {
        this.ctx.transform(...m.toArray());
    }

    /**
     * restore
     */
    public restore() {
        this.ctx.restore();
    }

    /**
     * save
     */
    public save() {
        this.ctx.save();
    }
}
