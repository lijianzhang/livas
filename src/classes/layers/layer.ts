import { observable } from 'liob';
import Size, { ISize } from '../size';
import Point, { IPoint } from '../point';
import Rect, { IRect } from '../rect';
import Matrix from '../matrix';

export interface ILayerDelegate {
    draw?(layer: Layer, context: CanvasRenderingContext2D): any;
    render(ctx: CanvasRenderingContext2D);
    renderSubLayers(ctx: CanvasRenderingContext2D);
}

@observable
export default class Layer {

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

    public hitTest(point: IPoint): boolean {
        const p = Point.transform(Point.offsetBy(point, this.frame.x, this.frame.y), this.transform);
        const [x, y, w, h] = Rect.toArray(this.bounds);

        if (p.x >= x && p.x <= w + x && p.y >= y && p.y <= h + y) {

            return true;
        }

        return false;
    }


    get isOpaque() {
        return this.opacity === 1;
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
            console.log(this.frame);
            ctx.translate(this.frame.x, this.frame.y);
        }

        ctx.translate(1, 1);
        if (this.backgroundColor) {
            const frame = {...this.bounds};
            if (this.borderWidth && this.borderColor) {
                frame.x += this.borderWidth;
                frame.y += this.borderWidth;
                frame.w -= this.borderWidth * 2;
                frame.h -= this.borderWidth * 2;
            }
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(...Rect.toArray(frame));
        }

        if (this.borderColor && this.borderWidth) {
            const frame = {...this.bounds};
            frame.x += this.borderWidth;
            frame.y += this.borderWidth;
            frame.w -= this.borderWidth * 2;
            frame.h -= this.borderWidth * 2;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            ctx.strokeRect(...Rect.toArray(frame));
        }

        if (this.delegate) {
            this.delegate.renderSubLayers(ctx);
        }

        if (this.delegate && this.delegate.draw) {
            this.delegate.draw(this, ctx);
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
    }
}
