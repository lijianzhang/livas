import Rect from './rect';
import { ISize } from './size';
import Matrix from './matrix';

export default class GraphicsContext {

    get backgroundColor() {
        return this.ctx.fillStyle as string;
    }

    set backgroundColor(value: string) {
        this.ctx.fillStyle = value;
    }
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public ctx: CanvasRenderingContext2D;

    public fillStyle: string | CanvasGradient | CanvasPattern;
    public font: string;
    public globalAlpha: number;
    public globalCompositeOperation: string;
    public imageSmoothingEnabled: boolean;
    public lineCap: string;
    public lineDashOffset: number;
    public lineJoin: string;
    public lineWidth: number;
    public miterLimit: number;
    public mozImageSmoothingEnabled: boolean;
    public msFillRule: CanvasFillRule;
    public oImageSmoothingEnabled: boolean;
    public shadowBlur: number;
    public shadowColor: string;
    public shadowOffsetX: number;
    public shadowOffsetY: number;
    public strokeStyle: string | CanvasGradient | CanvasPattern;
    public textAlign: string;
    public textBaseline: string;
    public webkitImageSmoothingEnabled: boolean;

    public fillRect(rect: Rect) {
        this.ctx.fillRect(rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
    }

    public setSize(size: ISize) {
        this.ctx.canvas.width = size.width;
        this.ctx.canvas.height = size.height;
    }

    public drawImage(img: any, rect: Rect) {
        this.ctx.drawImage(img, rect.minX, rect.minY, rect.width, rect.height);
    }

    /**
     * translate
     */
    public translate(x: number, y: number) {
        this.ctx.translate(x, y);
    }

    public transform(m: Matrix) {
        this.ctx.transform(...m.toArray());
    }

    /**
     * restore
     */
    public restore() {
        this.ctx.restore();
    }

    /**
     * save
     */
    public save() {
        this.ctx.save();
    }
    public beginPath(): void;
    public clearRect(x: number, y: number, w: number, h: number): void;
    public clip(fillRule?: CanvasFillRule): void;
    public clip(path: Path2D, fillRule?: CanvasFillRule): void;
    public createImageData(imageDataOrSw: number | ImageData, sh?: number): ImageData;
    public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
    public createPattern(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, repetition: string): CanvasPattern;
    public createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
    public drawFocusIfNeeded(element: Element): void;
    public drawFocusIfNeeded(path: Path2D, element: Element): void;
    public drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void;
    public drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void;
    public drawImage(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
    public fill(fillRule?: CanvasFillRule): void;
    public fill(path: Path2D, fillRule?: CanvasFillRule): void;
    public fillText(text: string, x: number, y: number, maxWidth?: number): void;
    public getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
    public getLineDash(): number[];
    public isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    public isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    public isPointInStroke(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    public isPointInStroke(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    public measureText(text: string): TextMetrics;
    public putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void;
    public restore(): void;
    public rotate(angle: number): void;
    public save(): void;
    public scale(x: number, y: number): void;
    public setLineDash(segments: number[]): void;
    public setTransform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): void;
    public stroke(path?: Path2D): void;
    public strokeRect(x: number, y: number, w: number, h: number): void;
    public strokeText(text: string, x: number, y: number, maxWidth?: number): void;
}
