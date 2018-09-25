import View from '../views/view';
import { observable } from 'liob';

@observable
export class GlobalStore {

    public currentView?: View;

    public isSelect = false;

    public isDrag = false;

    public mouse: {
        prePos: [number, number];
        pos: [number, number];
    } = {
        prePos: [0, 0],
        pos: [0, 0]
    };

    public context!: CanvasRenderingContext2D;
}

const globalStore = new GlobalStore();

(window as any).globalStore = globalStore;

export default globalStore;
