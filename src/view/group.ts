import LayerView, { attr, computed } from './layer';
export default class GroupView extends LayerView {

    constructor() {
        super();
    }

    public type = 'group';

    public subViews: LayerView[] = [];



    // public postion = { x: 0, y: 0 };
    @computed
    get postion() {
        const frames = this.subViews.map(v => v.drawFrame);

        const x = Math.min(...frames.map(([x]) => x), 0);
        const y = Math.min(...frames.map(([, y]) => y), 0);

        return {
            x,
            y
        };
    }

    set postion(value) {

    }

    @computed
    get size() {
        const frames = this.subViews.map(v => v.drawFrame);

        const maxX = Math.max(...frames.map(([x, , w]) => x + w), 0);
        const maxY = Math.max(...frames.map(([, y, , h]) => y + h), 0);

        return {
            w: maxX,
            h: maxY
        };
    }

    public useCache = true;

    public forceUpdate(onlyGroup: boolean = false) {
        if (this.parentView) {
            if (!onlyGroup) {
                this._needForceUpdate = true;
            }
            this.parentView.forceUpdate();
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        return undefined;
    }
}
