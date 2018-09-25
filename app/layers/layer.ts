/*
 * @Author: lijianzhang
 * @Date: 2018-09-25 15:32:46
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-26 04:47:48
 */
import Matrix from '../utils/matrix';
import { observable } from 'liob';

@observable
export default class Layer {
    constructor(x: number, y: number, w: number, h: number) {
        this.postion = [x, y];
        this.size = [w, h];
    }

    public superLayer?: Layer;

    public subLayers: Layer[] = [];

    public postion: [number, number];

    public size: [number, number];

    public anchor: [number, number] = [0.5, 0.5];


    get x() {
        const x = this.size[0] * (this.anchor[0] - 0.5);
        const y = this.size[1] * (this.anchor[1] - 0.5);

        return this.postion[0] -
            (Math.ceil(this.matrix.a * x + this.matrix.c * y + this.matrix.tx) - this.size[0] * this.anchor[0] + this.w / 2);
    }

    set x(v: number) {
        const diffX = this.x - this.postion[0];
        this.postion[0] = v - diffX;
    }

    get y() {
        const x = this.size[0] * (this.anchor[0] - 0.5);
        const y = this.size[1] * (this.anchor[1] - 0.5);

        return this.postion[1] -
            (Math.ceil(this.matrix.b * x + this.matrix.d * y + this.matrix.ty)  - this.size[1] * this.anchor[1] + this.h / 2);
    }

    set y(v: number) {
        const diffY = this.y - this.postion[1];
        this.postion[1] = v - diffY;
    }

    get w() {
        return Math.ceil(Math.abs(this.matrix.a) * this.size[0] +  Math.abs(this.matrix.c) * this.size[1]);
    }
    get h() {
        return Math.ceil(Math.abs(this.matrix.b) * this.size[0] +  Math.abs(this.matrix.d) * this.size[1]);
    }

    public backgroundColor?: string;

    public borderWidth?: number;

    public borderColor?: string;

    public _matrix = Matrix.default;

    get matrix() {
        if (this.superLayer) {
            return this._matrix.copy().multiply(this.superLayer.matrix);
        }

        return this._matrix;
    }

    public removeLayer<T extends Layer>(layer: T) {
        const index = this.subLayers.findIndex(v => v === layer);
        this.subLayers.splice(index, 1);
        layer.superLayer = undefined;
    }

    public addLayer<T extends Layer>(layer: T) {
        this.subLayers.push(layer);
        layer.superLayer = this;
    }

    public addLayers<T extends Layer>(layers: T[]) {
        layers.forEach(v => this.addLayer(v));
    }

    public draw(ctx: CanvasRenderingContext2D) {

        if (!this.matrix.isEmpty) {
            ctx.translate(Math.ceil(this.w / 2), Math.ceil(this.h / 2));
            ctx.transform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 0, 0);
            ctx.translate(-Math.ceil(this.size[0] / 2), -Math.ceil(this.size[1] / 2));
        }

        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, this.size[0], this.size[1]);
        }

        if (this.borderWidth && this.borderColor) {
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;
            ctx.strokeRect(0, 0, this.size[0], this.size[1]);
        }

        if (this.subLayers.length) {
            this.subLayers.forEach(l => {
                ctx.save();
                ctx.translate(l.x, l.y);
                l.draw(ctx);
                ctx.restore();
            });
        }
    }
}
