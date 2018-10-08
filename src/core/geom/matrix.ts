/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 02:25:10
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 02:51:34
 */

 export default class Matrix implements Livas.gemo.IMatrix {

    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

        /**
         * x轴的scale值
         *
         * @type {number}
         * @memberof IMatrix
         */
        public a: number;
        /**
         * y轴的skew值
         *
         * @type {number}
         * @memberof IMatrix
         */
        public b: number;

        /**
         * x轴的skew值
         *
         * @type {number}
         * @memberof IMatrix
         */
        public c: number;

        /**
         * y轴的scale值
         *
         * @type {number}
         * @memberof IMatrix
         */
        public d: number;

        /**
         * x轴的偏移值
         *
         * @type {number}
         * @memberof IMatrix
         */
        public tx: number;

        /**
         * y轴的偏移值
         *
         * @type {number}
         * @memberof IMatrix
         */
        public ty: number;

     public copy() {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    get isEmpty() {
        return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
    }

    public identity() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;

        return this;
    }

    public multiply(matrix: Partial<Livas.gemo.IMatrix>) {
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

    public rotate(angle: number) {
        let a = angle % 360;
        if (a > 180) a -= 360;
        else if (a < -180) a += 360;

        const cos = Math.cos(angle * Math.PI / 180);
        const sin = Math.sin(angle * Math.PI / 180);

        return this.multiply({ a: cos, b: sin, c: -sin, d: cos });
    }

    public transformPoint(x: number, y: number) {
        return {
            x: x * this.a + y * this.c + this.tx,
            y: x * this.b + y * this.d + this.ty
        };
    }

    public scale(x: number, y: number) {
        return this.multiply({ a: x, d: y });
    }

    public translate(tx: number, ty: number) {
        return this.multiply({ tx, ty });
    }

    /**
     * 翻转矩阵
     *
     * @returns
     * @memberof Matrix
     */
    public inverted() {

        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        const tx = this.tx;
        const ty = this.ty;


        if (b === 0 && c === 0) {
            if (a === 0 || d === 0) {
                this.a = this.d = this.tx = this.ty = 0;
            } else {
                a = this.a = 1 / a;
                d = this.d = 1 / d;
                this.tx = -a * tx;
                this.ty = -d * ty;
            }

            return this;
        }
        let determinant = a * d - b * c;
        if (determinant === 0) {
            this.identity();

            return this;
        }
        determinant = 1 / determinant;
        const k = this.a = d * determinant;
        b = this.b = -b * determinant;
        c = this.c = -c * determinant;
        d = this.d = a * determinant;
        this.tx = -(k * tx + c * ty);
        this.ty = -(b * tx + d * ty);

        return this;
    }
 }
