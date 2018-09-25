class CachePool {

    public readonly freeCaches: CanvasRenderingContext2D[] = [];

    public readonly useCaches: CanvasRenderingContext2D[] = [];

    public readonly idCaches: {[k in string | number ]: CanvasRenderingContext2D} = {};

    public getCache() {
        const cache = this.freeCaches.pop();
        if (cache) {
            this.useCaches.push(cache);

            return cache;
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            document.body.appendChild(canvas);
            this.useCaches.push(ctx);

            return ctx;
        }
    }

    public getCacheWithId(id: string | number) {
        let cache = this.idCaches[id];
        if (cache) {
            return cache;
        } else {
            cache = this.getCache();
            this[id] = cache;
        }

        return cache;
    }

    public freeCache(cache: CanvasRenderingContext2D) {
        const index = this.useCaches.findIndex(c => c === cache);
        this.useCaches.splice(index, 1);
        this.freeCaches.push(cache);
        cache.clearRect(0, 0, cache.canvas.width, cache.canvas.height);
    }
}

export default new CachePool();
