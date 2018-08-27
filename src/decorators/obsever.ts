import { Observer } from 'liob';

const baseRenderKey = Symbol('baseRender');


function reactiveRender(this: any, ctx: CanvasRenderingContext2D) {
    let res = null;
    res = this.$observer.collectDep(() => this[baseRenderKey](ctx));

    return res;
}

export default function toObserver(target) {
    return new Proxy(target, {
        construct(Cls, argumentsList: any[]) {
            const ob = new Cls(...argumentsList);

            ob[baseRenderKey] = ob.render.bind(ob);

            ob.$observer = new Observer(() => {
                ob.changed = true;
                ob.forceUpdate();
            }, `${ob.name || ob.constructor.name}.render()`);

            ob.render = reactiveRender.bind(ob);

            return ob;
        }
    });
}
