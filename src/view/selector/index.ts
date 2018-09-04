import GroupView from '../group';
import DotView from './dot';
import globalStore from '../../store/global';
import { IPostion, ISize } from '../../types';
import { IEventObj } from '../../utils/event';

export default class Selector extends GroupView {

    get currentView() {
        return globalStore.currentView;
        // if (globalStore.currentView) {
        //     return globalStore.currentViews[globalStore.currentViews.length - 1];
        // }

        // return null;
    }

    get postion() {
        let [x, y] = [0, 0];
        if (this.currentView) {
            [x , y] = this.currentView.frame;
            x -= 8;
            y -= 8;
            // if (this.currentView.lineWidth && this.currentView.color) {
            //     x -= this.currentView.lineWidth;
            //     y -= this.currentView.lineWidth;
            // }
            // const { left, top } = globalStore.currentView.padding || { left: 0, top: 0 } ;
            // return {x: x - left, y: y - top};
        }

        return { x, y };
    }

    set postion(pos: IPostion) {
        if (this.currentView) {
            this.currentView.postion = pos;
        }
    }

    get size() {
        let [w , h] = [0, 0];
        if (this.currentView) {
            // const { left, top, bottom, right } = globalStore.currentView.padding || { left: 0, top: 0, right: 0, bottom: 0 } ;
            [, , w, h] = this.currentView.frame;
            w += 16;
            h += 16;
            // return {w: w + left + right, h: h + top + bottom};
        }

        return { w, h };
    }

    set size(size: ISize) {
        if (this.currentView) {
            this.currentView.size = size;
        }
    }

    constructor() {
        super();
        (window as any).b = this;
        const dotView1 = new DotView(this, 'n');
        const dotView2 = new DotView(this, 'nw');
        const dotView3 = new DotView(this, 'ne');
        const dotView4 = new DotView(this, 'w');
        const dotView5 = new DotView(this, 'e');
        const dotView6 = new DotView(this, 's');
        const dotView7 = new DotView(this, 'sw');
        const dotView8 = new DotView(this, 'se');
        this.addViews([dotView1, dotView2, dotView3, dotView4, dotView5, dotView6, dotView7, dotView8]);
    }

    public type = 'tool: selector';

    public zIndex = 999999999999;

    public useCache = true;

    public onMouseDrag(e: IEventObj) {
        const diffX = e.pos.x - e.prePos.x;
        const diffY = e.pos.y - e.prePos.y;
        const [x, y] = [this.currentView!.postion.x + diffX, this.currentView!.postion.y + diffY];
        this.postion = { x, y };
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        const [x, y, w, h] = this.frame;

        // ctx.strokeRect(x , y, w - 16, h - 16);
        ctx.strokeRect(x + 8, y + 8, w - 16, h - 16);
        // ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x + 8, y + 8, w - 16, h - 16);
        super.draw(ctx);
    }
}
