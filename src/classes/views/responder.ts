import { IViewEvent, IEvent } from '../../utils/event';
import { IPoint } from '../point';
import View from './view';


export default abstract class Responder implements IViewEvent {
    public onMouseDown?(e: IEvent);

    public onMouseEnter?(e: IEvent);

    public onMouseLeave?();

    public onMouseDrag?(e: IEvent);

    public onMouseMove?(e: IEvent);

    public onMouseUp?(e: IEvent);

    public hitTest(pos: IPoint): View | null {
        throw new Error(`需要重写 hitTest ${pos}`) as any;
    }
}
