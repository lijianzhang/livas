/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 19:23:01
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 19:29:27
 */
export default class Event implements Livas.IEvent {
    constructor(type: Livas.EventTypes, target: Livas.IView, postion: Livas.gemo.IPoint) {
        this.type = type;
        this.target = target;
        this.postion = postion;
        this.timeStamp = Date.now();
    }
    public type: Livas.EventTypes;
    public target: Livas.IView;
    public postion: Livas.gemo.IPoint;
    public readonly timeStamp: number;

    private _bubbles = false;

    public stopPropagation() {
        this._bubbles = true;
    }

    get bubbles() {
        return this._bubbles;
    }
}
