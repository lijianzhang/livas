/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 23:38:28
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 00:08:21
 */

export default class Rect implements Livas.gemo.IRect {
    public static createFromPoints(...arg: Livas.gemo.IPoint[]) {
        let x = arg[0].x;
        let y = arg[0].y;
        let w = arg[0].x;
        let h = arg[0].y;
         for (let i: number = 1; i < arg.length; i += 1) {
             if (arg[i] == null)continue;
             if (x > arg[i].x) {
                 x = arg[i].x;
             }
             if (y > arg[i].y) {
                 y = arg[i].y;
             }
             if (w < arg[i].x) {
                 w = arg[i].x;
             }
             if (h < arg[i].y) {
                 h = arg[i].y;
             }
         }

         return new Rect(Math.ceil(x), Math.ceil(y), Math.ceil(w - x), Math.ceil(h - y));
     }
    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    public x: number;

    public y: number;

    public width: number;

    public height: number;

    public isPointIn(point: Livas.gemo.IPoint) {
        return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height;
    }
}
