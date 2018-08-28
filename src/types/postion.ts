export interface IPostion {
    x: number;
    y: number;
}

export interface ISize {
    w: number;
    h: number;
}

export type IRect = IPostion & ISize;
