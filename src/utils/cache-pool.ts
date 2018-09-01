export default class CachePool {

    public readonly freeCaches: CanvasRenderingContext2D[] = [];

    public readonly useCaches: CanvasRenderingContext2D[] = [];

    public getCache() {
        const cache = this.freeCaches.pop();
        if (cache) {
            this.useCaches.push(cache);

            return cache;
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
        cache.clearRect(0, 0, cache.canvas.width, cache.canvas.height);
    }
}
