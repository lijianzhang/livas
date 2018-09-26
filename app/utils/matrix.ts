export default class Matrix {

    public static get default() {
        return new Matrix(1, 0, 0, 1, 0, 0);
    }

    get isEmpty() {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
    }

    public static initWithScale(sx: number, sy: number) {
        return new Matrix(1, sx, sy, 1, 0, 0);
    }

    public static initWithTranslation(tx: number, ty: number) {
        return new Matrix(1, 0, 0, 1, tx, ty);
    }

    public static initWithRotate(angle: number) {
        const cos = Math.cos(angle * Math.PI / 180);
        const sin = Math.sin(angle * Math.PI / 180);

        return new Matrix(cos, sin, -sin, cos, 0, 0);
    }


    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    public translate(tx: number, ty: number) {
        this.multiply({ tx, ty });
    }

    // get rotate() {
    //     const a = this.a;
    //     const b = this.b;
    //     const c = this.c;
    //     const d = this.d;
    //     const skewX = -Math.atan2(-c, d);
    //     const skewY = Math.atan2(b, a);
    //     const delta = Math.abs(skewX + skewY);
    //     let rotation = 0;
    //     if (delta < 0.00001 || Math.abs(Math.PI / 2 - delta) < 0.00001) {
    //         rotation = skewY;
    //         if (a < 0 && d >= 0) {
    //             rotation += (rotation <= 0) ? Math.PI : -Math.PI;
    //         }

    //     }

    //     return rotation;
    // }

    public rotate(angle: number) {
        let a = angle % 360;
        if (a > 180) a -= 360;
        else if (a < -180) a += 360;

        const cos = Math.cos(angle * Math.PI / 180);
        const sin = Math.sin(angle * Math.PI / 180);
        this.multiply({ a: cos, b: sin, c: -sin, d: cos });
    }

    public scale(x: number, y: number) {
        this.multiply({ a: x, d: y });

        return this;
    }

    public copy() {
        return new Matrix(...this.toArray());
    }

    public multiply(matrix: { a?: number; b?: number; c?: number; d?: number; tx?: number; ty?: number }) {
        const { a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0 } = matrix;
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const tx1 = this.tx;
        const ty1 = this.ty;

        this.a = (a * a1) + (b * c1);
        this.b = (a * b1) + (b * d1);
        this.c = (c * a1) + (d * c1);
        this.d = (c * b1) + (d * d1);

        this.tx = (tx * a1) + (ty * c1) + tx1;
        this.ty = (tx * b1) + (ty * d1) + ty1;

        return this;
    }

    public mirror() {
        this.multiply({ a: -1, d: -1 });

        return this;
    }

    public toArray(): [number, number, number, number, number, number] {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    }
}

(window as any).Matrix = Matrix;
