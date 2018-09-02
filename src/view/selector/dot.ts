import LayerView, { attr } from '../layer';
import SelectorView from './index';
import globalStore from '../../store/global';
import { IPostion } from '../../types';

type Direction = 'left' | 'top' | 'bottom' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export default class Point extends LayerView {

    get postion() {
        switch (this.direction) {
            case 'left':
                return {x: 0, y: this.selectorView.size.h / 2};
                break;
            case 'top':
                return { x: this.selectorView.size.w / 2, y: 0 };
            case 'right':
                return { x: this.selectorView.size.w - this.r * 2, y: this.selectorView.size.h / 2 };
            case 'bottom':
                return { x: this.selectorView.size.w / 2, y: this.selectorView.size.h - this.r * 2  };
            case 'top-left':
                return { x: 0, y: 0  };
            case 'top-right':
                return { x: this.selectorView.size.w - this.r * 2, y: 0 };
            case 'bottom-left':
                return { x: 0, y: this.selectorView.size.h - this.r * 2 };
            case 'bottom-right':
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

    private isDrag = false;

    public onMouseDown() {
        this.isDrag = true;
        this.background = '#ff5a5e';
        globalStore.context.canvas.style.cursor = 's-resize';
        globalStore.context.canvas.addEventListener('mousemove', this.changePostion);

        return false;
    }

    public changePostion = (e: MouseEvent) => {
        if (!this.isDrag) return;
        this.selectorView.postion = {
            x: e.offsetX - this.selectorView.frame[0] + this.selectorView.postion.x,
            y: e.offsetY - this.selectorView.frame[1] + this.selectorView.postion.y
        };
    }

    // public onMouseMove(_, pos: IPostion) {
    //     if (this.isDrag) {
    //         console.log(pos, this.selectorView.frame[0], this.selectorView.frame[1], this.selectorView.postion);
    //         const x = pos.x - this.selectorView.frame[0] + this.selectorView.postion.x;
    //         const y = pos.y - this.selectorView.frame[1] + this.selectorView.postion.y;

    //         this.selectorView.postion = { x, y };
    //     }

    //     return false;
    // }

    public onMouseUp() {
        console.log('onMouseUp');
        this.isDrag = false;
        globalStore.context.canvas.removeEventListener('mousemove', this.changePostion);

        return false;
    }

    public onMouseEnter() {
        this.background = '#ff5a5e';

        return true;
    }

    public onMouseLeave() {
        this.background = '#666';
        globalStore.context.canvas.style.cursor = 'default';

        return true;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.opacity;

        const { x, y } = this.postion;
        ctx.shadowColor = 'rgba(0,0,0,.15)';
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = '#fff';
        ctx.translate(this.r, this.r);

            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(x, y, this.r, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = this.background;
            ctx.beginPath();
            ctx.arc(
                x,
                y,
                this.r - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    }
}
