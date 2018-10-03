/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 01:41:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 22:06:52
 */

import AbstractRender from './abstract-render';
import canvasCachePool from './canvas-cache';
import EventManage from '../event/manage';

export default class CanvasRender extends AbstractRender {

    constructor(rootView: Livas.IView) {
        super();
        this.rootView = rootView;
        const canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d')!;
        this.eventMange = new EventManage(rootView, canvas);
    }

    protected rootView: Livas.IView;
    protected eventMange: EventManage;

    protected context: CanvasRenderingContext2D;

    get canvas() {
        return this.context.canvas;
    }

    public removeView(view: Livas.IView) {
        if (view.cacheKey) canvasCachePool.freeCacheById(view.id);
    }

    public destroy() {
        this.context.canvas.width = this.context.canvas.height = 0;
        this.eventMange.destroy();
    }

    public draw() {
        const width = this.rootView.layer.size.width;
        const height = this.rootView.layer.size.height;

        if (window.devicePixelRatio) {
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            this.canvas.height = height * 2;
            this.canvas.width = width * 2;
            this.context.scale(2, 2);
        }
        this.drawView(this.rootView);
    }

    protected drawView(view: Livas.IView) {
        let ctx = this.context;
        if (view.cacheKey) {
            ctx = canvasCachePool.getCacheById(view.cacheKey);
            if (view.hasChange) {
                const width = view.layer.drawRect.width;
                const height = view.layer.drawRect.height;
                ctx.save();

                ctx.canvas.height = height * 2 + 2;
                ctx.canvas.width = width * 2 + 2;
                ctx.scale(2, 2);

                ctx.translate(0.5, 0.5);
                view.render(ctx);
                ctx.restore();
            }
            this.context.drawImage(
                ctx.canvas,
                view.layer.frame.x + view.layer.drawRect.x - 1,
                view.layer.frame.y + view.layer.drawRect.y - 1,
                view.layer.drawRect.width,
                view.layer.drawRect.height
            );
        } else {
            view.render(ctx);
        }

        if (view.subViews.length) {
            view.subViews.forEach(v => this.drawView(v));
        }
    }
}
