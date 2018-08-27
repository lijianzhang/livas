export default class CachePool {

    get hasCache() {
        return this.size > (this.freeCaches.length + this.useCaches.length);
    }

    public readonly size: number;

    public readonly freeCaches: CanvasRenderingContext2D[] = [];

    public readonly useCaches: CanvasRenderingContext2D[] = [];
    constructor(size: number) {
        this.size = size;
    }

    public getCache() {
        const cache = this.freeCaches.pop();
        if (cache) {
            this.useCaches.push(cache);

            return cache;
        } else if (!this.hasCache) {
            return false;
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            this.useCaches.push(ctx);

            return ctx;
        }
    }

    public freeCache(cache: CanvasRenderingContext2D) {
        const index = this.useCaches.findIndex(c => c === cache);
        this.useCaches.splice(index, 1);
        this.freeCaches.push(cache);
    }
}
