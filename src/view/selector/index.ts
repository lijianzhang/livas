import GroupView from '../group';
import DotView from './dot';
import globalStore from '../../store/global';
import { IPostion, ISize } from '../../types';
import { IEventObj } from '../../utils/event';

export default class Selector extends GroupView {

    get currentView() {
        return globalStore.currentView;
    }

    get postion() {
        let [x, y] = [0, 0];
        if (this.currentView) {
            [x , y] = [this.currentView.x, this.currentView.y];
            x -= 8;
            y -= 8;
            // x -= w < 0 ? 8 : 8;
            // y -= h < 0 ? 8 : 8;
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
            [, , w, h] = this.currentView.frame;
            w += 16;
            h += 16;
        }

        return { w, h };
    }

    set size(size: ISize) {
        if (this.currentView) {
            this.currentView.size = size;
        }
    }

    get rotate() {
        if (this.currentView) {
            return this.currentView.rotate;
        }

        return 0;
    }

    set rotate(value) {
        if (this.currentView) {
            this.currentView.rotate = value;
        }
    }

    constructor() {
        super();
        (window as any).b = this;
        const dotView1 = new DotView(this, 'n');
        // const dotView2 = new DotView(this, 'nw');
        // const dotView3 = new DotView(this, 'ne');
        // const dotView4 = new DotView(this, 'w');
        // const dotView5 = new DotView(this, 'e');
        // const dotView6 = new DotView(this, 's');
        // const dotView7 = new DotView(this, 'sw');
        // const dotView8 = new DotView(this, 'se');
        this.addViews([dotView1]);
        // this.addViews([dotView1, dotView2, dotView3, dotView4, dotView5, dotView6, dotView7, dotView8]);
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
        const [, , w, h] = this.frame;
        ctx.strokeRect(8, 8, w - 16, h - 16);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(8, 8, w - 16, h - 16);
        super.draw(ctx);
    }
}
