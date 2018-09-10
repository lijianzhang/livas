import Matrix from './matrix';
import Size from './size';
import Point from './point';

export default class Rect {

    static get zero() {
        return new Rect(0, 0, 0, 0);
    }


    constructor(x: number | Point, y: number | Size, width?: number, height?: number) {
        if (typeof width === 'number') {
            this.origin = new Point(x as number, y as number);
            this.size = new Size(width, height as number);
        } else {
            this.size = y as Size;
            this.origin = x as Point;
        }
    }

    public origin: Point;
    public size: Size;

    get minX() {
        return this.origin.x;
    }

    get minY() {
        return this.origin.y;
    }

    get midX() {
        return this.minX + this.width / 2;
    }

    get midY() {
        return this.minY + this.size.height / 2;
    }

    get maxX() {
        return this.minX + this.width;
    }

    get maxY() {
        return this.minY + this.height;
    }

    get width() {
        return this.size.width;
    }

    get height() {
        return this.size.height;
    }

    get isEmpty() {
        return this.size.width === 0 || this.size.height === 0;
    }

    get standardized() {
        let x = this.minX;
        let y = this.minY;
        let w = this.width;
        let h = this.height;

        if (w < 0) {
            x += w;
            w = -w;
        }

        if (h < 0) {
            y += h;
            h = -h;
        }

        return new Rect(x, y, w, h);
    }

    /**
     * Returns a rectangle that is smaller or larger than the source rectangle, with the same center point.
     *
     * @param {number} dx
     * @param {number} dy
     * @returns
     * @memberof Rect
     */
    public insetBy(dx: number, dy: number) {
        const x = this.origin.x - dx;
        const y = this.origin.y - dy;
        const w = this.size.width + dx;
        const h = this.size.height + dy;

        return new Rect(x, y, w, h);
    }

    /**
     *
     * @param {number} dx
     * @param {number} dy
     * @returns a rectangle with an origin that is offset from that of the source rectangle
     * @memberof Rect
     */
    public offsetBy(dx: number, dy: number) {
        const x = this.origin.x - dx;
        const y = this.origin.y - dy;

        return new Rect(x, y, this.size.width, this.size.height);
    }

    /**
     * TODO: 待完成
     * @returns {Point} the point resulting from an affine transformation of an existing point.
     * @param {Matrix} transform
     * @memberof Point
     */
    public applying(transform: Matrix): Size {
        const origin = this.origin.applying(transform);
        const size = this.size.applying(transform);

        return new Rect(origin, size);
    }

    /**
     *
     *
     * @param {Rect} r2
     * @returns 返回包含两个矩形的最小矩形
     * @memberof Rect
     */
    public union(r2: Rect) {
        const minX = Math.min(this.minX, r2.minX);
        const miny = Math.min(this.minY, r2.minY);
        const maxX = Math.max(this.maxX, r2.maxX);
        const maxY = Math.max(this.maxY, r2.maxY);

        return new Rect(minX, miny, maxX, maxY);
    }

    public intersection(r2: Rect) {
        let x1 = this.minX;
        let x2 = r2.minX;

        if (x1 > x2) [x1, x2] = [x2, x1];

        let y1 = this.minY;
        let y2 = r2.minY;

        if (y1 > y2) [y1, y2] = [y2, y1];

        const x = x2 * 2 - x1;
        const y = y2 * 2 - y1;
        const w = x2 - x1;
        const h = y2 - y1;

        return new Rect(x, y, w, h);
    }

    /**
     * Returns whether two points are equal.
     *
     * @param {Point} point
     * @returns
     * @memberof Point
     */
    public equalTo(rect: Rect) {
        return this.origin.equalTo(rect.origin) && this.size.equalTo(rect.size);
    }
}
