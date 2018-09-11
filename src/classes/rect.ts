import Matrix from './matrix';
import Size, { ISize } from './size';
import Point, { IPoint } from './point';


export interface IRect extends IPoint, ISize {

}

const Rect = {
    init(x: number, y: number, w: number, h: number) {
        return { x, y, w, h };
    },
    zero() {
        return { x: 0, y: 0, h: 0, w: 0 };
    },
    midX(rect: IRect) {
        return rect.x + rect.w / 2;
    },
    midY(rect: IRect) {
        return rect.y + rect.h / 2;
    },
    maxX(rect: IRect) {
        return rect.x + rect.w;
    },
    maxY(rect: IRect) {
        return rect.y + rect.h;
    },
    isEmpty(rect: IRect) {
        return rect.w === 0 || rect.h === 0;
    },
    standardized(rect: IRect) {
        let x = rect.x;
        let y = rect.y;
        let w = rect.w;
        let h = rect.h;

        if (w < 0) {
            x += w;
            w = -w;
        }

        if (h < 0) {
            y += h;
            h = -h;
        }

        return { x, y, w, h };
    },
    transform(rect: IRect, transform: Matrix): IRect {
        const origin = Point.transform(rect, transform);
        const size = Size.transform(rect, transform);

        return {...origin, ...size};
    },
    equalTo(rect: IRect, otherRect: IRect) {
        return Point.equalTo(rect, otherRect) && Size.equalTo(rect, otherRect);
    },
    toArray(rect: IRect): [number, number, number, number] {
        return [rect.x, rect.y, rect.w, rect.h];
    },
    union(r1: IRect, r2: IRect) {
        const minX = Math.min(r1.x, r2.x);
        const miny = Math.min(r1.y, r2.y);
        const maxX = Math.max(r1.x + r1.w, r2.x + r2.w);
        const maxY = Math.max(r1.y + r1.h, r2.y + r2.h);

        return {x: minX, y: miny, w: maxX, h: maxY};
    },
    intersection(r1: IRect, r2: IRect) {
        let x1 = r1.x;
        let x2 = r2.x;

        if (x1 > x2) [x1, x2] = [x2, x1];

        let y1 = r1.y;
        let y2 = r2.y;

        if (y1 > y2) [y1, y2] = [y2, y1];

        const x = x2 * 2 - x1;
        const y = y2 * 2 - y1;
        const w = x2 - x1;
        const h = y2 - y1;

        return {x, y, w, h};
    }
};

export default Rect;
