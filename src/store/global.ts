import { LayerView } from '../view';
import { observable } from 'liob';
import { IPostion } from '../types';
@observable
export class GlobalStore {
    public currentViews?: LayerView[];

    public isSelect = false;

    public isDrag = false;

    public mouseEvent?: { e: MouseEvent; pos: IPostion };

    public context!: CanvasRenderingContext2D;
}

const globalStore = new GlobalStore();

(window as any).globalStore = globalStore;

export default globalStore;
