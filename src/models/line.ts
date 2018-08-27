import { observable } from 'liob';
import Base, { attr } from './base';

@observable
export default class Line extends Base {
    @attr
    public pos: { x: number; y: number }[] = [];

    get postion() {
        const arrX = this.pos.map(p => p.x);
        const arrY = this.pos.map(p => p.y);
        const minX = Math.min(...arrX);
        const minY = Math.min(...arrY);

        return {
            x: minX,
            y: minY,
        };
    }

    set postion(value) {

    }

    get size() {
        const arrX = this.pos.map(p => p.x);
        const arrY = this.pos.map(p => p.y);
        const minX = Math.min(...arrX);
        const minY = Math.min(...arrY);

        return {
            w: Math.max(...arrX) - minX,
            h: Math.max(...arrY) - minY,
        };
    }

    set size(value) {
        
    }
}
