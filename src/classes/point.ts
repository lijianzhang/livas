import Matrix from './matrix';

export default class Point {

    static get zero() {
        return new Point(0, 0);
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public x: number;
    public y: number;

    /**
     * TODO: 待完成
     * Returns the point resulting from an affine transformation of an existing point.
     * @param {Matrix} transform
     * @returns {Point}
     * @memberof Point
     */
    public applying(transform: Matrix): Point {
        return new Point(1, 1);
    }

    /**
     * Returns whether two points are equal.
     *
     * @param {Point} point
     * @returns
     * @memberof Point
     */
    public equalTo(point: Point) {
        return this.x === point.x && this.y === point.y;
    }
}
