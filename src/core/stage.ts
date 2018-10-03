import View from './views/view';
import Render from './renders/canvas-render';
/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 20:50:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 21:17:08
 */

export default class State {
    constructor(width: number, height: number) {
        this.view = new View({ x: 0, y: 0, width, height });
        this.render = new Render(this.view);
        this.view.forceUpdate = () => {this.draw(); };
    }

    public readonly view: View;

    public readonly render: Render;

    get canvas() {
        return this.render.canvas;
    }

    public draw() {
        this.render.draw();
    }
}
