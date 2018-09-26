import Tool from './tool';
import globalStore from '../store/global';
import { IEvent } from '../utils/event';
import SelectorControl, { ISelectControlDelegate, directions } from './view-selector-control';

/*
 * @Author: lijianzhang
 * @Date: 2018-09-26 03:28:00
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-26 17:52:55
 */


 export default class ViewSelector extends Tool implements ISelectControlDelegate {


    get x() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.x;
    }

    get y() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.y;
    }

    get w() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.w;
    }

    get h() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.h;
    }
    constructor() {
        super(0, 0, 0, 0);
        directions.forEach(k => {
            const view = new SelectorControl(7, 7, k);
            view.delegate = this;
            this.addView(view);
        });
    }

    get direction() {
        const directions = [];
        if (!globalStore.currentView) return directions;
        const dots = globalStore.currentView.dots.toString(2).split('').reverse();
        if (dots[0]) { directions.push('ne'); }

        if (dots[1]) { directions.push('e'); }

        if (dots[2]) { directions.push('se'); }

        if (dots[3]) { directions.push('s'); }

        if (dots[4]) { directions.push('sw'); }

        if (dots[5]) { directions.push('w'); }

        if (dots[6]) { directions.push('nw'); }

        if (dots[7]) { directions.push('n'); }

        return directions;
    }

    get selectView() {
        return globalStore.currentView;
    }

    public onMouseDrag(e: IEvent) {
        const diffX = e.pos[0] - e.prePos[0];
        const diffY = e.pos[1] - e.prePos[1];
        // if (e.pos[0])

        globalStore.currentView!.layer._matrix.multiply({ tx: -diffX, ty: -diffY });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (!globalStore.currentView) return undefined;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#666666';
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        this.drawDot(ctx);
    }

    private drawDot(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';

        const points = [];
        const dots = globalStore.currentView.dots.toString(2).split('').reverse();
    }
 }
