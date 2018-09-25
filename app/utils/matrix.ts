export default class Matrix {
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

    public static get default() {
        return new Matrix(1, 0, 0, 1, 0, 0);
    }


    constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    get isEmpty() {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
    }

    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    public scaledBy(x: number, y: number) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;

        return this;
    }

    public translatedBy(x: number, y: number) {
        this.tx += x;
        this.ty += y;

        return this;
    }

    public rotateBy(angle: number) {
        let a = angle % 360;
        if (a > 180) a -= 360;
        else if (a < -180) a += 360;

        const cos = Math.cos(angle * Math.PI / 180);
        const sin = Math.sin(angle * Math.PI / 180);

        const a1 = this.a;
        const c1 = this.c;
        const tx1 = this.tx;
        this.a = (a1 * cos) - (this.b * sin);
        this.b = (a1 * sin) + (this.b * cos);
        this.c = (c1 * cos) - (this.d * sin);
        this.d = (c1 * sin) + (this.d * cos);
        this.tx = (tx1 * cos) - (this.ty * sin);
        this.ty = (tx1 * sin) + (this.ty * cos);

        return this;
    }

    public copy() {
        return new Matrix(...this.toArray());
    }

    public mirror() {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const tx1 = this.tx;
        const n = (a1 * d1) - (b1 * c1);
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = ((c1 * this.ty) - (d1 * tx1)) / n;
        this.ty = -((a1 * this.ty) - (b1 * tx1)) / n;

        return this;
    }

    public toArray(): [number, number, number, number, number, number] {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    }
}

(window as any).Matrix = Matrix;
