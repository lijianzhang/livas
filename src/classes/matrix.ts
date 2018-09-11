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


    constructor(a: number, b: number, c: number, d: number, tx: number, ty: number) {
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

        return this;
    }

    public translatedBy(x: number, y: number) {
        this.tx += x;
        this.ty += y;

        return this;
    }

    public rotateBy(angle: number) {
        const cos = Math.cos(angle * Math.PI / 180);
        const sin = Math.sin(angle * Math.PI / 180);

        this.a *= cos;
        this.b += sin;
        this.c += -sin;
        this.d *= cos;

        return this;
    }

    public mirror() {
        return new Matrix(this.a, this.b, - this.c, - this.d, this.tx, this.ty);
    }

    public toArray(): [number, number, number, number, number, number] {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    }
}
