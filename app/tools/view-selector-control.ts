import Tool from './tool';
import globalStore from '../store/global';
import { IEvent } from '../utils/event';
import View from '../views/view';

export const directions =  ['ne', 'e', 'se', 's', 'sw', 'w', 'nw', 'n'];

export type IDirection = string;

export interface ISelectControlDelegate {
    direction: IDirection[];
    selectView: View;
}

/*
 * @Author: lijianzhang
 * @Date: 2018-09-26 03:28:00
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-27 00:24:27
 */
 export default class ViewSelectorControl extends Tool {

    constructor(w: number, h: number, direction: IDirection) {
        super(0, 0, w, h);
        this.layer.backgroundColor = '#fff';
        this.layer.borderWidth = 1;
        this.layer.borderColor = '#000';
        this.direction = direction;
    }

    get x() {
        if (!this.superView) return 0;

        return this.superView.x + this.xy[0];
    }

    get y() {
        if (!this.superView) return 0;

        return this.superView.y + this.xy[1];
    }

    public useCache = 'selecotrControl';

    get xy() {
        if (!this.superView) return [0, 0];
        switch (this.direction) {
            case 'ne':
                return [this.superView.w - this.w, 0];
                break;
            case 'e':
                return [this.superView.w - this.w, this.superView.h / 2 - Math.ceil(this.w / 2)];
                break;
            case 'se':
                return [this.superView.w - this.w, this.superView.h - this.h];
                break;
            case 'n':
                return [this.superView.w / 2 - Math.ceil(this.w / 2), 0];
                break;
            case 'nw':
                return [0, 0];
                break;
            case 'w':
                return [0, this.superView.h / 2 - Math.ceil(this.w / 2)];
                break;
            case 'sw':
                return [0, this.superView.h - this.h];
                break;
            case 's':
                return [this.superView.w / 2 - Math.ceil(this.w / 2), this.superView.h - this.w];
                break;
            default:
                return [0, 0];
        }

    }

    public delegate: ISelectControlDelegate;

    private direction: IDirection;

    public onMouseDrag(e: IEvent) {
        let diffX = e.pos[0] - e.prePos[0];
        let diffY = e.pos[1] - e.prePos[1];



        if (/^[we]$/.test(this.direction)) {
            diffY = 0;
        } else if (/^[ns]$/.test(this.direction)) {
            diffX = 0;
        }


        if (/w/.test(this.direction)) {
            this.delegate.selectView.x += diffX;
            diffX = -diffX;
        }


        if (/n/.test(this.direction)) {
            this.delegate.selectView.y += diffY;
            diffY = -diffY;
        }

        // if (this.delegate.selectView.size[0] < 0) diffX = -diffX;
        // if (this.delegate.selectView.size[1] < 0) diffY = -diffY;

        console.log('diffx', diffX);
        this.delegate.selectView.w += diffX;
        this.delegate.selectView.h += diffY;
    }

    public render(ctx: CanvasRenderingContext2D) {
        if (!this.delegate || !this.delegate.direction.includes(this.direction)) return undefined;
        super.render(ctx);
    }
 }
