import { Observer } from 'liob';

const baseRenderKey = Symbol('baseRender');
const isReCollectDepsKey = Symbol('isReCollectDeps');

function reactiveRender(this: any, ctx: CanvasRenderingContext2D) {
    let res = null;
    res = this.$observer.collectDep(() => this[baseRenderKey](ctx));
    return res;
}

export default function toObserver(target:  any) {
    return new Proxy(target, {
        construct(Cls, argumentsList: any[]) {
            const ob = new Cls(...argumentsList as any);

            ob[baseRenderKey] = ob.draw.bind(ob);

            ob.$observer = new Observer(() => {
                ob.changed = true;
                ob.rootCanvas.readDraw();
            }, `${ob.name || ob.constructor.name}.render()`);

            ob.draw = reactiveRender.bind(ob);
            return ob;
        },
    });
}