/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-02 01:17:00
 */
import LayerView, { attr, computed } from './layer';
import { IPostion } from '../types';

 export default class BrushView extends LayerView {

    @computed
    get postion() {
        const arrX = this.postions.map(p => p.x);
        const arrY = this.postions.map(p => p.y);
        const minX = Math.min(...arrX);
        const minY = Math.min(...arrY);

        return {
            x: minX,
            y: minY
        };
    }

    @computed
    get size() {
        const arrX = this.postions.map(p => p.x);
        const arrY = this.postions.map(p => p.y);
        const minX = Math.min(...arrX);
        const minY = Math.min(...arrY);

        return {
            w: Math.max(...arrX) - minX,
            h: Math.max(...arrY) - minY
        };
    }

    get padding() {
        const w = Math.ceil(this.lineWidth / 2);

        return {
            top: w,
            left: w,
            bottom: w,
            right: w
        };
    }

    public useCache = true;

    public type = 'brush';

    @attr
    public postions: IPostion[] = [];

    constructor() {
        super();
    }

    public midPointBtw(p1: IPostion, p2: IPostion) {
        return {
          x: p1.x + (p2.x - p1.x) / 2,
          y: p1.y + (p2.y - p1.y) / 2
        };
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.lineWidth || 0.5;
        ctx.strokeStyle = this.strokeColor;
        ctx.lineCap = this.lineCap;
        ctx.lineJoin = this.lineJoin;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        if (this.parentView) {
            const [x1, y1] = this.parentView.frame;
            ctx.translate(x1, y1);
        }

        let p1 = this.postions[0];
        let p2 = this.postions[1];
        const { x, y } = p1;
        ctx.moveTo(x, y);
        for (let index = 1; index < this.postions.length; index += 1) {
            const { x, y } = p1;
            const minPoint = this.midPointBtw(p1, p2);
            ctx.quadraticCurveTo(x, y, minPoint.x, minPoint.y);
            p1 = p2;
            p2 = this.postions[index + 1];
        }
        ctx.stroke();
    }

    public pointInside(pos: IPostion) {
        if (this.postions.length < 2) return false;

        const diff = Math.max(10, this.lineWidth) / 2;
        for (let index = 0; index < this.postions.length - 1; index += 1) {
            const p1 = this.postions[index];
            const p2 = this.postions[index + 1];
            const [x1, x2] = p1.x > p2.x ? [p2.x, p1.x] : [p1.x, p2.x];
            const [y1, y2] = p1.y > p2.y ? [p2.y, p1.y] : [p1.y, p2.y];
            if (x1 - diff <= pos.x && pos.x <= x2 + diff && y1 - diff <= pos.y && pos.y <= y2 + diff) {

                return true;
            }

        }

        return false;
    }

    public onMouseDown(e: MouseEvent, pos: IPostion) {
        return false;
    }
 }
