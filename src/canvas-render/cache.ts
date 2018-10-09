/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 01:38:54
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 22:11:43
 */

class CachePool {

    private readonly freeCaches: CanvasRenderingContext2D[] = [];

    private readonly viewCaches: Map<number | string | symbol, CanvasRenderingContext2D> = new Map();

    public getCacheById(id: number | string | symbol) {
        let cache: CanvasRenderingContext2D | undefined = this.viewCaches.get(id);

        if (cache) {
            return cache;
        } else {
            cache = this.freeCaches.pop();
            if (!cache) {
                const canvas = document.createElement('canvas');
                cache = canvas.getContext('2d')!;
            }

            this.viewCaches.set(id, cache);

            return cache;
        }
    }



    public freeCacheById(id: number | symbol | string) {
        const cache = this.viewCaches.get(id);
        if (cache) {
            this.viewCaches.delete(id);
            if (this.freeCaches.length < 100) {
                this.freeCaches.push(cache);
            }
            cache.canvas.width = cache.canvas.height = 0;
        }
    }
}

export default new CachePool();
