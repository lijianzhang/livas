import GroupView from '../group';
import DotView from './dot';
import globalStore from '../../store/global';
import { IPostion, ISize } from '../../types';

export default class Selector extends GroupView {

    constructor() {
        super();
        (window as any).b = this;
        const dotView1 = new DotView(this, 'left');
        const dotView2 = new DotView(this, 'right');
        const dotView3 = new DotView(this, 'bottom');
        const dotView4 = new DotView(this, 'top');
        const dotView5 = new DotView(this, 'top-left');
        const dotView6 = new DotView(this, 'top-right');
        const dotView7 = new DotView(this, 'bottom-left');
        const dotView8 = new DotView(this, 'bottom-right');
        this.addViews([dotView1, dotView2, dotView3, dotView4, dotView5, dotView6, dotView7, dotView8]);
    }

    public type = 'tool: selector';

    get currentView() {
        return globalStore.currentView;
        // if (globalStore.currentView) {
        //     return globalStore.currentViews[globalStore.currentViews.length - 1];
        // }

        // return null;
    }

    public zIndex = 999999999999;

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

    public useCache = true;

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
