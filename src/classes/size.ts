import Matrix from './matrix';

export interface ISize {
    w: number;
    h: number;
}

const Size = {
    zero() {
        return { w: 0, h: 0 };
    },
    transform(size: ISize, m: Matrix) {
        const w = Math.abs(m.a) * size.w +  Math.abs(m.c) * size.h;
        const h = Math.abs(m.b) * size.w + Math.abs(m.d) * size.h;

        return {w, h};
    },
    equalTo(size: ISize, otherSize: ISize) {
        return otherSize.w === size.w && otherSize.h === size.h;
    }
};


export default Size;
