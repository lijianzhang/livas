import { LayerView } from '../view';
import { observable } from 'liob';
import { IPostion } from '../types';
@observable
export class GlobalStore {
    public currentView?: LayerView;

    public isSelect = false;

    public isDrag = false;

    public mouse: {
        prePos: IPostion;
        pos: IPostion;
    } = {
        prePos: {x: 0, y: 0},
        pos: {x: 0, y: 0}
    };

    public context!: CanvasRenderingContext2D;
}

const globalStore = new GlobalStore();

(window as any).globalStore = globalStore;

export default globalStore;
