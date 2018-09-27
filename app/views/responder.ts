import { IViewEvent, IEvent } from '../utils/event';
import View from './view';


export default abstract class Responder implements IViewEvent {
    public onMouseDown?(e: IEvent);

    public onMouseEnter?(e: IEvent);

    public onMouseLeave?();

    public onMouseDrag?(e: IEvent);

    public onMouseDragEnd?(e: IEvent);

    public onMouseMove?(e: IEvent);

    public onMouseUp?(e: IEvent);

    public hitTest(pos: [number, number]): View | null {
        throw new Error(`需要重写 hitTest ${pos}`) as any;
    }
}
