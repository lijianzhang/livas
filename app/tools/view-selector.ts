import View from '../views/view';
import globalStore from '../store/global';

/*
 * @Author: lijianzhang
 * @Date: 2018-09-26 03:28:00
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-26 04:44:59
 */
 export default class ViewSelector extends View {
    constructor() {
        super(0, 0, 0, 0);
    }

    get x() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.x - 2;
    }

    get y() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.y - 2;
    }

    get w() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.w + 4;
    }

    get h() {
        if (!globalStore.currentView) return 0;

        return globalStore.currentView.h + 4;
    }


    public draw(ctx: CanvasRenderingContext2D) {
        console.log('draw');
        if (!globalStore.currentView) return undefined;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.strokeRect(0, 0, this.w, this.h);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(0,0,0,.5)';
        ctx.strokeRect(0, 0, this.w, this.h);
    }
 }
