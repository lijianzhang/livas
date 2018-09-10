import Matrix from './matrix';

export default class Size {

    static get zero() {
        return new Size(0, 0);
    }

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    public width: number;
    public height: number;

    /**
     * Returns the point resulting from an affine transformation of an existing point.
     * @param {Matrix} transform
     * @returns {Point}
     * @memberof Point
     */
    public applying(transform: Matrix) {
        const w = transform.a * this.width + transform.c * this.height;
        const h = transform.b * this.width + transform.d * this.height;

        return new Size(w, h);
    }

    /**
     * Returns whether two points are equal.
     *
     * @param {Point} point
     * @returns
     * @memberof Point
     */
    public equalTo(size: Size) {
        return this.width === size.width && this.height === size.height;
    }
}
