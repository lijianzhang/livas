import LayerView, { attr } from '../layer';
import SelectorView from './index';
import globalStore from '../../store/global';
import { IEventObj } from '../../utils/event';

type Direction = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export default class Point extends LayerView {

    get postion() {
        switch (this.direction) {
            case 'w':
                return {x: 0, y: this.selectorView.size.h / 2};
                break;
            case 'n':
                return { x: this.selectorView.size.w / 2, y: 0 };
            case 'e':
                return { x: this.selectorView.size.w - this.r * 2, y: this.selectorView.size.h / 2 };
            case 's':
                return { x: this.selectorView.size.w / 2, y: this.selectorView.size.h - this.r * 2  };
            case 'nw':
                return { x: 0, y: 0  };
            case 'ne':
                return { x: this.selectorView.size.w - this.r * 2, y: 0 };
            case 'sw':
                return { x: 0, y: this.selectorView.size.h - this.r * 2 };
            case 'se':
                return { x: this.selectorView.size.w - this.r * 2, y: this.selectorView.size.h - this.r * 2 };
            default:
                return { x: 0, y: 0};
        }
    }

    get size() {
        return { w: this.r * 2, h: this.r * 2 };
    }
    constructor(selectorView: SelectorView, direction: Direction) {
        super();
        this.selectorView = selectorView;
        this.direction = direction;
    }

    public selectorView: SelectorView;

    public type = 'tool: selector.dot';

    public direction: Direction;

    public r: number = 8;

    @attr
    public background = '#666';

    public useCache = true;

    // public onMouseDown() {
    //     this.isDrag = true;
    //     this.background = '#ff5a5e';
    //     globalStore.context.canvas.style.cursor = 's-resize';
    //     globalStore.context.canvas.addEventListener('mousemove', this.changePostion);

    //     return false;
    // }

    public onMouseDrag(e: IEventObj) {
        this.background = '#666';
        globalStore.context.canvas.style.cursor = 'default';

        switch (this.direction) {
            case 'nw': {
                const diffX = e.pos.x - e.prePos.x;
                const diffY = e.pos.y - e.prePos.y;
                this.selectorView.currentView!.postion.x += diffX;
                this.selectorView.currentView!.postion.y += diffY;
                this.selectorView.currentView!.size.w -= diffX;
                this.selectorView.currentView!.size.h -= diffY;
                break;
            }
            case 'n': {
                const diffY = e.pos.y - e.prePos.y;
                this.selectorView.currentView!.postion.y += diffY;
                this.selectorView.currentView!.size.h -= diffY;
                break;
            }
            case 'ne': {
                const diffX = e.pos.x - e.prePos.x;
                const diffY = e.pos.y - e.prePos.y;
                this.selectorView.currentView!.postion.y += diffY;
                this.selectorView.currentView!.size.w += diffX;
                this.selectorView.currentView!.size.h -= diffY;
                break;
            }
            case 'w': {
                const diffX = e.pos.x - e.prePos.x;
                this.selectorView.currentView!.postion.x += diffX;
                this.selectorView.currentView!.size.w -= diffX;
                break;
            }
            case 'e': {
                const diffX = e.pos.x - e.prePos.x;
                this.selectorView.currentView!.size.w += diffX;
                break;
            }
            case 'sw': {
                const diffX = e.pos.x - e.prePos.x;
                const diffY = e.pos.y - e.prePos.y;
                this.selectorView.currentView!.postion.x += diffX;
                this.selectorView.currentView!.size.w -= diffX;
                this.selectorView.currentView!.size.h += diffY;
                break;
            }
            case 'se': {
                const diffX = e.pos.x - e.prePos.x;
                const diffY = e.pos.y - e.prePos.y;
                this.selectorView.currentView!.size.w += diffX;
                this.selectorView.currentView!.size.h += diffY;
                break;
            }
            case 's': {
                const diffY = e.pos.y - e.prePos.y;
                this.selectorView.currentView!.size.h += diffY;
                break;
            }
            default:
        }
    }


    public onMouseEnter() {
        this.background = '#ff5a5e';
        globalStore.context.canvas.style.cursor = `${this.direction}-resize`;
    }

    public onMouseUp() {
        this.background = '#666';
        globalStore.context.canvas.style.cursor = 'default';

        return true;
    }

    public onMouseLeave() {
        this.background = '#666';
        globalStore.context.canvas.style.cursor = 'default';
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;

        ctx.shadowColor = 'rgba(0,0,0,.15)';
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = '#fff';
        ctx.translate(this.r, this.r);

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = this.background;
            ctx.beginPath();
            ctx.arc(
                0,
                0,
                this.r - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
    }
}
