import Layer from '../layers/layer';
import Rect from '../rect';
import GraphicsContext from '../graphics-context';
import Point from '../point';

let id = 0;

export default class View {

    get frame() {
        return this.layer.frame;
    }

    set frame(rect: Rect) {
        this.layer.frame = rect;
    }

    get backgroundColor() {
        return this.layer.backgroundColor;
    }

    set backgroundColor(color: string) {
        this.layer.backgroundColor = color;
    }

    constructor(rect: Rect = Rect.zero) {
        this.layer.frame = rect;
        // this.layer.delegate = this;
        id += id;
        this.id = id;
        const canvas = document.createElement('canvas');
        canvas.width = 0;
        canvas.height = 0;
        this.cacheContext = new GraphicsContext(canvas.getContext('2d')!);
    }

    public id: number;

    public layer = new Layer();

    public cacheContext: GraphicsContext;

    public superView?: View;

    public subViews: View[] = [];

    private needUpdate = true;

    public hitTest(pos: Point) {
        return !!this.layer.hitTest(pos);
    }

    public render(ctx: GraphicsContext) {
        if (this.needUpdate) {
            this.cacheContext.setSize(this.layer.frame.size);
            this.layer.render(this.cacheContext);
            this.needUpdate = false;
        }
        ctx.drawImage(
            this.cacheContext.ctx.canvas,
            this.layer.frame
        );
    }
}
