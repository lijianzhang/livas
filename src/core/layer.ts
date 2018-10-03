import Matrix from './geom/matrix';
import Rect from './geom/rect';
import { observable, computed } from 'liob';
/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 23:37:17
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 22:11:05
 */

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

    public anchorPoint = {x: 0, y: 0};

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
        const rect = this.bounds;

        const p1 = this.transform.transformPoint(rect.x, rect.y);
        const p2 = this.transform.transformPoint(rect.x + rect.width, rect.y);
        const p3 = this.transform.transformPoint(rect.x + rect.width, rect.y + rect.height);
        const p4 = this.transform.transformPoint(rect.x, rect.y + rect.height);

        return Rect.createFromPoints(p1, p2, p3, p4);
    }


    public draw(ctx: Livas.IReanderContenxt) {
        ctx.save();
        if (!this.transform.isEmpty) {
            ctx.translate(Math.ceil(this.drawRect.width / 2), Math.ceil(this.drawRect.height / 2));
            ctx.transform(this.transform.a, this.transform.b, this.transform.c, this.transform.d, 0, 0);
            ctx.translate(-Math.ceil(this.size.width / 2), -Math.ceil(this.size.height / 2));
        }

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
        ctx.restore();
    }
}
