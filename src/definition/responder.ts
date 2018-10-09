/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 00:28:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 11:39:37
 */
declare namespace Livas {
    export interface  IResponder {
        onMouseDown?(e: IEvent);

        onMouseEnter?(e: IEvent);

        onMouseLeave?();

        onMouseDrag?(e: IEvent);

        onMouseDragEnd?(e: IEvent);

        onMouseMove?(e: IEvent);

        onMouseUp?(e: IEvent);

        hitTest(pos: gemo.IPoint): IResponder | null;
    }
}

