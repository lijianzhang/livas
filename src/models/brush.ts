/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 17:44:23
 */
import BaseModel, { attr } from './base';
import { IPostion } from '../types/postion';


 export default class BrushModel extends BaseModel {
    public static type = 'brush';

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

    @attr
    public postions: IPostion[] = [];

    public midPointBtw(p1: IPostion, p2: IPostion) {
        return {
          x: p1.x + (p2.x - p1.x) / 2,
          y: p1.y + (p2.y - p1.y) / 2
        };
    }
 }
