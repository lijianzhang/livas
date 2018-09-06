import GroupView from './group';
import SelectorView from './selector';
import GriddingView from './gridding';
import globalStore from '../store/global';
import Event from '../utils/event' ;


export default class Canvas extends GroupView  {

    constructor(el: HTMLElement, w: number = 400, h: number = 400) {
        super();
        this.el = el;

        this.canvas = document.createElement('canvas');
        this.canvas.height = h * devicePixelRatio;
        this.canvas.width = w * devicePixelRatio;

        this.postion = { x: 0, y: 0 };

        this.size = { w, h };

        this.context = this.canvas.getContext('2d')!;

        this.context.scale(devicePixelRatio, devicePixelRatio);

        this.el.appendChild(this.canvas);

        this.event = new Event(this);
        this.selector = new SelectorView();
        const griddingView = new GriddingView();
        griddingView.size = this.size;
        this.addView(griddingView);
        this.addView(this.selector);
        globalStore.context = this.context;
        this.forceUpdate();
    }


    public canvas: HTMLCanvasElement;

    public selector: SelectorView;

    public context: CanvasRenderingContext2D;

    public type = 'canvas';

    public useCache = false;

    private event: Event;

    private el: HTMLElement;

    private willDraw = false;



    public render = () => {
        this.$observer.beginCollectDep();
        if (this.visible && !this.isEmpty) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.save();
            this.privateRender(this.context);
            this.context.restore();
        }
        this.$observer.endCollectDep();
        this.willDraw = false;
    }

    public forceUpdate() {
        if (this.willDraw) return;
        this.willDraw = true;
        requestAnimationFrame(this.render);
    }
}
