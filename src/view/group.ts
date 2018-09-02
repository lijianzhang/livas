import LayerView, { attr, computed } from './layer';
export default class GroupView extends LayerView {

    public type = 'group';

    public subViews: LayerView[] = [];

    @attr
    public postion = { x: 0, y: 0 };

    @attr
    public size = { w: 0, h: 0 };

    public useCache = true;

    @computed
    get sortSubViews() {
        return [...this.subViews].sort((a, b) => {
            return a.zIndex - b.zIndex;
        });
    }

    public removeView<T extends LayerView>(el: T) {
        const index = this.subViews.findIndex(e => e === el);
        this.subViews.splice(index, 1);
        // el.postion = { x: el.postion.x + this.postion.x, y: el.postion.y + this.postion.y };
        el.parentView = undefined;
        el.destory();
        this.forceUpdate(true);
    }

    public forceUpdate(onlyGroup: boolean = false) {
        if (this.parentView) {
            if (!onlyGroup) {
                this._needForceUpdate = true;
            }
            this.parentView.forceUpdate();
        }
    }

    public addView<T extends LayerView>(el: T) {
        this.subViews.push(el);
        // el.postion = { x: this.postion.x - el.postion.x, y: this.postion.y - el.postion.y };
        el.parentView = this;
        this.forceUpdate(true);
    }

    public addViews<T extends LayerView>(els: T[]) {
        els.forEach(e => this.addView(e));
    }

    protected draw(ctx: CanvasRenderingContext2D) {
        for (let index = 0; index < this.sortSubViews.length; index += 1) {
            this.sortSubViews[index].render(ctx);
        }
    }
}
