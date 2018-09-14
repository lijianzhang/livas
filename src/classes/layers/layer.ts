import { observable } from 'liob';
import Size, { ISize } from '../size';
import Point, { IPoint } from '../point';
import Rect, { IRect } from '../rect';
import Matrix from '../matrix';

export interface ILayerDelegate {
    draw?(layer: Layer, context: CanvasRenderingContext2D): any;
    renderLayer?(ctx: CanvasRenderingContext2D);
    render(ctx: CanvasRenderingContext2D);
    renderSubLayers(ctx: CanvasRenderingContext2D);
}

@observable
export default class Layer {

    get frame() {
        const size = Size.transform(this.bounds, this.transform);
        const origin = this.getCenter(size);

        return { ...origin, ...size };
    }

    set frame(rect: IRect) {
        const { x, y, w, h } = rect;
        this.bounds.w = w;
        this.bounds.h = h;
        this.position = { x, y };
    }


    get isOpaque() {
        return this.opacity === 1;
    }

    public name?: string;

    public bounds = Rect.zero();

    public delegate?: ILayerDelegate;

    public position: IPoint = Point.zero();

    public anchor: [number, number] = [0.5, 0.5];

    public contentsScale: [number, number] = [1, 1];

    public transform: Matrix = Matrix.default;

    public opacity: number = 1;

    public isHidden: boolean = false;

    public backgroundColor: string = '#fff';

    public masksToBounds: boolean = false;

    public mask?: Layer;

    public isDoubleSided: boolean = false;

    public cornerRadius: number = 0;

    public borderColor?: string;

    public borderWidth: number = 0;

    public shadowOpacity: number = 0;

    public shadowRadius: number = 0;

    public shadowOffset?: ISize;

    public shadowColor?: string;

    public shadowPath?: string;

    public style?: object;

    public subLayers: Layer[] = [];

    public superLayer?: Layer;


    public getCenter(size: ISize) {
        const differX =
            this.bounds.w * (this.anchor[0] - 0.5) * this.transform.a
            - this.bounds.h * (this.anchor[1] - 0.5) * this.transform.b
            - this.bounds.w * (this.anchor[0])  + size.w / 2;
        const differY =
            this.bounds.h * (this.anchor[1] - 0.5) * this.transform.a
            + this.bounds.w * (this.anchor[0] - 0.5) * this.transform.b
            - this.bounds.h * (this.anchor[1])  + size.h / 2;

        return {
            x: Math.floor(this.position.x - differX + this.transform.tx),
            y: Math.floor(this.position.y - differY + this.transform.ty)
        };
    }

    get anchorPoint() {
        return {
            x: this.position.x + this.frame.w * this.anchor[0],
            y: this.position.y + this.frame.h * this.anchor[1]
        };
    }

    public hitTest(point: IPoint): boolean {
        const p = this.getPointWithView(point);
        console.log('point', point, 'p', p, {...this.bounds, ...this.position }, 'anchor', this.anchorPoint);

        const { w, h } = this.bounds;
        const { x, y } = this.position;

        if (p.x >= x && p.x <= w + x && p.y >= y && p.y <= h + y) {

            return true;
        }

        return false;
    }

    public getPointWithView(pos: IPoint) {
        return Point.rotateByCenter(pos, this.transform.copy().mirror(), this.anchorPoint);
    }

    public render(ctx: CanvasRenderingContext2D): any {
        if (Rect.isEmpty(this.frame)) return undefined;
        ctx.save();
        if (!this.transform.isEmpty) {
            ctx.translate(Math.ceil(this.frame.w / 2), Math.ceil(this.frame.h / 2));
            const transform = this.transform.copy();
            transform.tx = 0;
            transform.ty = 0;
            ctx.transform(...transform.toArray());
            ctx.translate(Math.ceil(-this.bounds.w / 2), Math.ceil(-this.bounds.h / 2));
        }

        if (this.superLayer) {
            ctx.translate(this.frame.x, this.frame.y);
        }

        ctx.translate(1, 1);

        if (this.delegate && this.delegate.renderLayer) {
            this.delegate.renderLayer(ctx);
        } else {
            this._render(ctx);
            if (this.delegate && this.delegate.draw) {
                this.delegate.draw(this, ctx);
            }
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
    }

    /**
     * 基本的渲染方法, 如果 delegate 实现了 renderLayer 将不会执行该方法
     *
     * @private
     * @param {CanvasRenderingContext2D} ctx
     * @memberof Layer
     */
    private _render(ctx: CanvasRenderingContext2D) {
        if (this.backgroundColor) {
            const frame = {...this.bounds};
            if (this.borderWidth && this.borderColor) {
                // frame.x += this.borderWidth;
                // frame.y += this.borderWidth;
                // frame.w -= this.borderWidth * 2;
                // frame.h -= this.borderWidth * 2;
            }
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(...Rect.toArray(frame));
        }

        if (this.borderColor && this.borderWidth) {
            const frame = {...this.bounds};
            // frame.x += this.borderWidth;
            // frame.y += this.borderWidth;
            // frame.w -= this.borderWidth * 2;
            // frame.h -= this.borderWidth * 2;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            ctx.strokeRect(...Rect.toArray(frame));
        }

        if (this.delegate) {
            this.delegate.renderSubLayers(ctx);
        }
    }
}
