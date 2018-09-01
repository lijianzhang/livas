import LayerView from './layer';

export default class GroupView extends LayerView {

    public type = 'group';

    public subViews: LayerView[] = [];

    public postion = { x: 0, y: 0 };

    public size = { w: 0, h: 0 };

    public useCache = true;

    public removeView<T extends LayerView>(el: T) {
        const index = this.subViews.findIndex(e => e === el);
        this.subViews.splice(index, 1);
        // el.postion = { x: el.postion.x + this.postion.x, y: el.postion.y + this.postion.y };
        el.parentView = undefined;
        this.forceUpdate();
    }

    public addView<T extends LayerView>(el: T) {
        this.subViews.push(el);
        this.forceUpdate();
        // el.postion = { x: this.postion.x - el.postion.x, y: this.postion.y - el.postion.y };
        el.parentView = this;
    }

    protected draw(ctx: CanvasRenderingContext2D) {
        console.log('draw group', this.id);
        for (let index = 0; index < this.subViews.length; index += 1) {
            this.subViews[index].render(ctx);
        }
    }
}
