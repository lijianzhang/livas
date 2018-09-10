import Rect from './rect';

export default class GraphicsContext {
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public ctx: CanvasRenderingContext2D;

    get backgroundColor() {
        return this.ctx.fillStyle as string;
    }

    set backgroundColor(value: string) {
        this.ctx.fillStyle = value;
    }

    public fillRect(rect: Rect) {
        this.ctx.fillRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
    }
}
