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
     * TODO: 待完成
     * Returns the point resulting from an affine transformation of an existing point.
     * @param {Matrix} transform
     * @returns {Point}
     * @memberof Point
     */
    public applying(transform: Matrix): Size {
        return new Size(1, 1);
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
