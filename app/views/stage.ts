import View from './view';
import Event from '../utils/event';
import Selector from '../tools/view-selector';
import Tool from '../tools/tool';
/*
 * @Author: lijianzhang
 * @Date: 2018-09-25 21:01:24
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-27 23:44:33
 */

 export default class StageView extends View {

     get canvas() {
        return this.ctx.canvas;
     }
     constructor(w: number, h: number) {
        super(0, 0, w, h);
        const canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d')!;
        canvas.width = w;
        canvas.height = h;
        this.forceUpdate();
        this.event = new Event(this);
        const selector = new Selector();
        this.registerTool(selector);
     }

     public event: Event;

     public tools: Tool[] = [];

     private willDraw = false;

     private ctx: CanvasRenderingContext2D;

     public registerTool(tool: Tool) {
         tool.superView = this;
         this.tools.push(tool);
     }

     public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.update);
    }

    public render(ctx: CanvasRenderingContext2D) {
        super.render(ctx);
        if (this.tools.length) {
            this.tools.forEach(t => t.render(ctx));
        }
    }

     private update = () => {
        this.ctx.canvas.width = this.layer.w;
        this.ctx.canvas.height = this.layer.h;
        this.render(this.ctx);
        this.willDraw = false;
    }
 }
