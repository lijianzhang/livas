import Base from '../models/base';
import Canvas from '../canvas';
import { IPostion } from '../types/postion';

let id = 0;

export interface State {
    x: number;
    y: number;

    w: number;
    h: number;

    lineWidth?: number;
    fillStyle?: string;
}

export default abstract class BaseElement {

    get cache() {
        if (!this._cacheContext) {
            const canvas = document.createElement('canvas');
            canvas.width = this.data.size.w;
            canvas.height = this.data.size.h;
            this._cacheContext = canvas.getContext('2d')!;
            this.draw(this._cacheContext);
        } else if (this.changed) {
            this.draw(this._cacheContext);
            this.changed = false;
        }

        return this._cacheContext.canvas;
    }

    public rootCanvas!: Canvas;

    public abstract readonly data: Base;

    public readonly id: number;

    public changed = false;

    private _cacheContext?: CanvasRenderingContext2D;
    constructor() {
        id += 1;
        this.id = id;
    }

    public forceUpdate() {
        this.rootCanvas.forceUpdate();
    }

    get boundRect() {
        return {
            ...this.data.size,
            ...this.data.postion
        };
    }

    get useCache() {
        return false;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public midPointBtw(p1: IPostion, p2: IPostion) {
        return {
          x: p1.x + (p2.x - p1.x) / 2,
          y: p1.y + (p2.y - p1.y) / 2
        };
    }

    public getPrecisePosition(postion: IPostion) {
        if (this.data.lineWidth % 2 === 0) {
            return postion;
        }

        return {
            x: postion.x - 0.5,
            y: postion.y - 0.5
        };
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (!this.useCache) return this.draw(ctx);
        if (!this.rootCanvas) return null;
        const { x, y, w, h } = this.boundRect;
        if (w === 0 || h === 0) return null;
        if (!this._cacheContext) {
            const canvas = document.createElement('canvas');
            this._cacheContext = canvas.getContext('2d')!;
            this._cacheContext.canvas.width = w + this.data.lineWidth * 2;
            this._cacheContext.canvas.height = h + this.data.lineWidth * 2;
            this._cacheContext.save();
            this._cacheContext.translate(- x + this.data.lineWidth, - y + this.data.lineWidth);
            this.draw(this._cacheContext);
            this._cacheContext.restore();
        }

        if (this.changed) {
            this._cacheContext.clearRect(0, 0, this._cacheContext.canvas.width, this._cacheContext.canvas.height);
            this._cacheContext.canvas.width = w + this.data.lineWidth * 2;
            this._cacheContext.canvas.height = h + this.data.lineWidth * 2;
            this._cacheContext.save();
            this._cacheContext.translate(- x + this.data.lineWidth, - y + this.data.lineWidth);
            this.draw(this._cacheContext);
            this._cacheContext.restore();
            this.changed = false;
        }

        ctx.drawImage(this._cacheContext.canvas, x - this.data.lineWidth, y - this.data.lineWidth);
    }
}
