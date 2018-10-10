/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 23:37:17
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 22:11:05
 */
import Matrix from './geom/matrix';
import Rect from './geom/rect';
import { observable, computed } from 'liob';


let id = 0;

@observable
export default class Layer implements Livas.IBaseLayer {
    constructor(frame: Livas.gemo.IRect) {
        id += 1;
        this.id = id;
        this.frame = new Rect(frame.x, frame.y, frame.width, frame.height);
        this.bounds = new Rect(0, 0, frame.width, frame.height);
    }

    public id: number;

    public frame: Livas.gemo.IRect;

    public bounds: Livas.gemo.IRect;

    public delegate?: Livas.ILayerDelegate;

    get position() {
        return { x: this.frame.x, y: this.frame.y };
    }

    get size() {
        return { width: this.frame.width, height: this.frame.height };
    }

    public anchorPoint = { x: 0.5, y: 0.5 };

    public transform = new Matrix();

    public subLayers: Layer[] = [];

    public superLayer?: Layer;

    public backgroundColor: string = '#fff';

    public borderColor?: string;

    public borderWidth?: number;

    public removeSubLayer<T extends Layer>(layer: T) {
        const index = this.subLayers.findIndex(v => v === layer);
        this.subLayers.splice(index, 1);
        layer.superLayer = undefined;
    }

    public addSubLayer<T extends Layer>(layer: T) {
        this.subLayers.push(layer);
        layer.superLayer = this;
    }

    public addSubLayers<T extends Layer>(layers: T[]) {
        layers.forEach(v => this.addSubLayer(v));
    }

    @computed
    public get drawRect() {

        if (this.transform.isEmpty) {
            return this.frame;
        }

        const { x, y, width, height } = this.bounds;

        const p1 = this.transform.transformPoint(x, y);
        const p2 = this.transform.transformPoint(x + width, y);
        const p3 = this.transform.transformPoint(x + width, y + height);
        const p4 = this.transform.transformPoint(x, y + height);

        const rect = Rect.createFromPoints(p1, p2, p3, p4);

        const p5 = this.transform.transformPoint(width * this.anchorPoint.x, height * this.anchorPoint.y);
        rect.x += (width * this.anchorPoint.x - p5.x) + this.frame.x;
        rect.y += (height * this.anchorPoint.y - p5.y) + this.frame.y;

        return rect;
    }


    public draw(ctx: Livas.IReanderContenxt) {
        if (!this.transform.isEmpty) {
            ctx.translate(Math.ceil(this.drawRect.width / 2), Math.ceil(this.drawRect.height / 2));
            ctx.transform(this.transform.a, this.transform.b, this.transform.c, this.transform.d, 0, 0);
            ctx.translate(-Math.ceil(this.size.width / 2), -Math.ceil(this.size.height / 2));
        }

        ctx.rect(-0.5, -0.5, this.size.width + 1, this.size.height + 1);
        ctx.clip();

        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, this.size.width, this.size.height);
        }

        if (this.borderWidth && this.borderColor) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            ctx.strokeRect(0, 0, this.size.width, this.size.height);
        }

        if (this.subLayers.length) {
            this.subLayers.forEach(layer => {
                ctx.save();
                ctx.translate(layer.frame.x, layer.frame.y);
                layer.draw(ctx);
                ctx.restore();
            });
        }

        if (this.delegate) this.delegate.draw(this, ctx);
    }
}
