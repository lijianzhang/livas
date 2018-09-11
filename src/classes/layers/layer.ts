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

    public delegate?: ILayerDelegate;

    public position: Point = Point.zero;

    public anchor: [number, number] = [0.5, 0.5];

    public contentsScale: [number, number] = [1, 1];

    public transform: Matrix = Matrix.default;

    public opacity: number = 1;

    public isHidden: boolean = false;

    public backgroundColor: string = '#000';

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

    public getCenter(size: Size) {
        const differX =
            this.bounds.width * (this.anchor[0] - 0.5) * this.transform.a
            - this.bounds.height * (this.anchor[1] - 0.5) * this.transform.b
            - this.bounds.width * (this.anchor[0])  + size.width / 2;
        const differY =
            this.bounds.height * (this.anchor[1] - 0.5) * this.transform.a
            + this.bounds.width * (this.anchor[0] - 0.5) * this.transform.b
            - this.bounds.height * (this.anchor[1])  + size.height / 2;

        return new Point(
            this.position.x - differX,
            this.position.y - differY
        );
    }

    get frame() {
        const size = this.bounds.size.applying(this.transform);
        const origin = this.getCenter(size);

        return new Rect(origin, size);
    }

    set frame(rect: Rect) {
        this.bounds.size = rect.size;
        this.position = rect.origin;
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
        const p = point.offsetBy(this.frame.minX, this.frame.minY).applying(this.transform);
        console.log('hitTest', p);
        const [x, y, w, h] = this.bounds.toArray();

        if (p.x >= x && p.x <= w + x && p.y >= y && p.y <= h + y) {
            if (this.subLayers) {
                const subPoint = point.offsetBy(this.position.x, this.position.y);
                for (let index = this.subLayers.length - 1; index >= 0; index -= 1) {
                    const layer = this.subLayers[index].hitTest(subPoint);
                    if (layer) {
                        return layer;
                    }
                }
            }

            return this;
        }

        return null;
    }


    get isOpaque() {
        return this.opacity === 1;
    }

    public render(ctx: GraphicsContext) {
        ctx.save();
        if (!this.transform.isEmpty) {
            ctx.translate(this.frame.width / 2, this.frame.height / 2);
            ctx.transform(this.transform);
            ctx.translate(-this.bounds.width / 2, -this.bounds.height / 2);
        }
        if (this.backgroundColor) {
            ctx.backgroundColor = this.backgroundColor;
            ctx.fillRect(this.bounds);
        }

        if (this.borderWidth) {

        }

        if (this.subLayers.length) {
            this.subLayers.forEach(l => l.render(ctx));
        }
        ctx.restore();
    }
}
