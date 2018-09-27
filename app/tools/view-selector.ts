import Tool from './tool';
import globalStore from '../store/global';
import { IEvent } from '../utils/event';
import SelectorControl, { ISelectControlDelegate, directions } from './view-selector-control';

/*
 * @Author: lijianzhang
 * @Date: 2018-09-26 03:28:00
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-27 22:28:23
 */

 export default class ViewSelector extends Tool implements ISelectControlDelegate {


    get x() {
        if (!this.selectView) return 0;

        return this.selectView.x;
    }

    get y() {
        if (!this.selectView) return 0;

        return this.selectView.y;
    }

    get w() {
        if (!this.selectView) return 0;

        return this.selectView.w;
    }

    get h() {
        if (!this.selectView) return 0;

        return this.selectView.h;
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
        if (!this.selectView) return directions;
        const dots = this.selectView.dots.toString(2).split('').reverse();
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
        if (globalStore.currentView && globalStore.currentView.superView) return globalStore.currentView;
    }

    public onMouseDrag(e: IEvent) {
        const diffX = e.pos[0] - e.prePos[0];
        const diffY = e.pos[1] - e.prePos[1];
        // if (e.pos[0])

        this.selectView!.layer._matrix.multiply({ tx: -diffX, ty: -diffY });
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#666666';
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.closePath();
        ctx.stroke();
    }
 }
