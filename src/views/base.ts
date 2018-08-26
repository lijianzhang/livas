import Base from '../models/base';
import Canvas from '../canvas';

let id = 0;

export interface State {
    x: number;
    y: number;

    w: number;
    h: number;

    lineWidth?: number;
    fillStyle?: string;
}


export default abstract class BaseElement {
    constructor() {
        id += 1;
        this.id = id;
    }

    rootCanvas!: Canvas;

    abstract data: Base;

    public readonly id: number;

    changed = false;

    public abstract draw(ctx: CanvasRenderingContext2D): void;
}