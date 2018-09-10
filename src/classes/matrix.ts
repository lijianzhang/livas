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

    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    public scaledBy(x: number, y: number) {
        const [, b, c, , tx, ty] = this.toArray();

        return new Matrix(x, b, c, y, tx, ty);
    }

    public translatedBy(x: number, y: number) {
        const [a, b, c, d] = this.toArray();

        return new Matrix(a, b, c, d, x, y);
    }

    public rotateBy(angle: number) {
        const cos = Math.cos(angle * Math.PI / 180);
        const sin = Math.sin(angle * Math.PI / 180);

        return new Matrix(cos, sin, -sin, cos, this.tx, this.ty);
    }

    public toArray() {
        return [this.a, this.b, this.c, this.d, this.tx, this.ty];
    }
}
