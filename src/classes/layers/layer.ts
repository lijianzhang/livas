import Size from '../size';
import Point from '../point';
import Rect from '../rect';
import Matrix from '../matrix';
import GraphicsContext from '../graphics-context';

export interface ILayerDelegate {
    displayLayer?(layer: Layer);
    draw?(layer: Layer, context: CanvasRenderingContext2D);
}

export default class Layer {

    public name?: string;

    public bounds = Rect.zero;

    public center!: Point;

    public delegate?: ILayerDelegate;

    public position: Point = Point.zero;

    public anchorPoint: Point = new Point(0.5, 0.5);

    public contentsScale: [number, number] = [1, 1];

    public transform: Matrix = Matrix.default;

    public opacity: number = 1;

    public isHidden: boolean = false;

    public backgroundColor?: string;

    public masksToBounds: boolean = false;

    public mask?: Layer;

    public isDoubleSided: boolean = false;

    public cornerRadius: number = 0;

    public borderColor?: string;

    public borderWidth: number = 0;

    public shadowOpacity: number = 0;

    public shadowRadius: number = 0;

    public shadowOffset?: Size;

    public shadowColor?: string;

    public shadowPath?: string;

    public style?: object;

    public subLayers: Layer[] = [];

    public superLayer?: Layer;

    get frame() {
        const origin = this.position.applying(this.transform);
        const size = this.bounds.size.applying(this.transform);

        return new Rect(origin, size);
    }

    set frame(rect: Rect) {
        this.position = rect.origin;
        this.bounds.size = rect.size;
    }

    public removeFromSuperLayer() {
        if (this.superLayer) {
            const index = this.superLayer.subLayers.findIndex(l => l === l);
            if (index > -1) this.superLayer.subLayers.splice(index, 1);
        }
    }

    public insertSublayerAt(at: number, layer: Layer) {
        this.subLayers.splice(at, 0, layer);
    }

    public insertSublayerBelow(below: number, layer: Layer) {
        this.subLayers.splice(below - 1, 0, layer);
    }

    public insertSublaerAbove(ablove: number, layer: Layer) {
        this.subLayers.splice(ablove + 1, 0, layer);
    }

    public replaceSublaer(layer: Layer, withLayer: Layer) {
        const index = this.subLayers.findIndex(l => l === layer);
        if (index > -1) {
            this.subLayers.splice(index, 1, withLayer);
        }
    }

    public addSublayer(layer: Layer) {
        this.subLayers.push(layer);
    }

    public hitTest(point: Point): Layer | null {
        return this;
    }

    public contains(point: Point) {
        return false;
    }

    get isOpaque() {
        return this.opacity === 1;
    }

    public render(ctx: GraphicsContext) {
        ctx.ctx.translate(this.frame.origin.x, this.frame.origin.y);
        ctx.ctx.transform(...this.transform.toArray());
        if (this.backgroundColor) {
            ctx.backgroundColor = this.backgroundColor;
            ctx.fillRect(this.bounds);
        }
    }


    public draw(ctx: GraphicsContext) {

        return null;
    }
}
