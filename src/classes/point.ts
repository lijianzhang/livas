import Matrix from './matrix';

export interface IPoint {
    x: number;
    y: number;
}

const Point = {
    zero() {
        return { x: 0, y: 0};
    },
    transform(point: IPoint, transform: Matrix): IPoint {
        const x = transform.a * point.x + transform.c * point.y + transform.tx;
        const y = transform.b * point.x + transform.d * point.y + transform.ty;

        return {x, y};
    },
    rotateByCenter(point: IPoint, transform: Matrix, centerPoint: IPoint) {
        return {
            x: (point.x  - centerPoint.x) * transform.a + (point.y - centerPoint.y) * transform.c + centerPoint.x,
            y: (point.x - centerPoint.x) * transform.b + (point.y - centerPoint.y) * transform.d + centerPoint.y
        };
    },
    rotate(point, transform) {
        const x = transform.a * point.x + transform.c * point.y;
        const y = transform.b * point.x + transform.d * point.y;

        return {x, y};
    },
    offsetBy(point: IPoint, x: number, y: number) {
        return { x: point.x - x, y: point.y - y };
    },
    equalTo(point: IPoint, otherPoint: IPoint) {
        return otherPoint.x === point.x && otherPoint.y === point.y;
    }
};


export default Point;

