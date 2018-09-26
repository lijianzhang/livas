import View from '../views/view';
import { observable } from 'liob';
import Tool from '../tools/tool';

@observable
export class GlobalStore {

    public currentView?: View;

    public currentTool?: Tool;

    public isSelect = false;

    public isDrag = false;

    public mouse: {
        prePos: [number, number];
        pos: [number, number];
        target: View;
    } = {} as any;

    public context!: CanvasRenderingContext2D;
}

const globalStore = new GlobalStore();

(window as any).globalStore = globalStore;

export default globalStore;
