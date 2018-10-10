/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 01:41:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 22:06:52
 */

import { AbstractRender, View } from '../core';
import canvasCachePool from './cache';
import EventManage from './event-manage';

export default class CanvasRender extends AbstractRender {

    constructor(rootView: View) {
        super();
        this.rootView = rootView;
        const canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d')!;
        this.eventMange = new EventManage(rootView, canvas);
        this.rootView.forceUpdate = () => {this.draw(); };
    }

    protected rootView: View;
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

        if (window.devicePixelRatio && this.rootView.hasChange) {
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            this.canvas.height = height * 2;
            this.canvas.width = width * 2;
            this.context.scale(2, 2);
        }
        this.drawView(this.rootView, this.context);
    }

    protected drawView(view: View, context: CanvasRenderingContext2D) {
        let ctx = context;
        if (view.cacheKey) {
            ctx = canvasCachePool.getCacheById(view.cacheKey);
            ctx.save();

            const width = Math.ceil(view.layer.drawRect.width) + 1;
            const height = Math.ceil(view.layer.drawRect.height) + 1;
            ctx.save();
            ctx.canvas.width = width * 2 + 2;
            ctx.canvas.height = height * 2 + 2;
            ctx.scale(2, 2);
            ctx.translate(1, 1);
            view.render(ctx);

            if (view.subViews.length) {
                view.subViews.forEach(v => this.drawView(v, ctx));
            }

            context.drawImage(
                ctx.canvas,
                1,
                1,
                ctx.canvas.width - 0.5,
                ctx.canvas.height - 0.5,
                view.layer.drawRect.x,
                view.layer.drawRect.y,
                width,
                height
            );
            ctx.restore();
        } else {
            ctx.save();
            ctx.translate(view.layer.drawRect.x, view.layer.drawRect.y);
            view.render(ctx);
            if (view.subViews.length) {
                view.subViews.forEach(v => this.drawView(v, ctx));
            }
            ctx.restore();
        }
    }
}
