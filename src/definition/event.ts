/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 00:28:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 19:28:12
 */
declare namespace Livas {
    export enum EventTypes {
        mousedown = 'mousedown',
        mouseup = 'mouseup',
        mousemove = 'mousemove'
    }

    export interface IEvent {
        /**
         * 对事件起源目标的View
         *
         * @type {IView}
         * @memberof IEvent
         */
        target: IView;
        /**
         *
         *
         * @type {gemo.IPoint}
         * @memberof IEvent
         */
        postion: gemo.IPoint;
        /**
         * 事件类型
         *
         * @type {EventTypes}
         * @memberof IEvent
         */
        type: EventTypes;

        /**
         * 事件创建时的时间戳
         *
         * @type {number}
         * @memberof IEvent
         */
        readonly timeStamp: number;

        /**
         * 可不可以冒泡
         *
         * @type {boolean}
         * @memberof IEvent
         */
        readonly bubbles: boolean;
        /**
         * 阻止事件冒泡
         *
         * @memberof IEvent
         */
        stopPropagation();
    }
}
