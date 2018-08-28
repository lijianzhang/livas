import 'reflect-metadata';
import { IPostion, ISize } from '../types/postion';

/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 14:18:55
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 18:25:49
 */
const attrsMetadataKey = Symbol('attrs');


/**
 * 标记属性字段
 * @param target BaseView
 * @param key 字段名
 */
export function attr<T extends BaseModel>(target: T, key: string) {
    const attrs = Reflect.getOwnMetadata(attrsMetadataKey, target) || [];
    attrs.push(key);
    Reflect.defineMetadata(attrsMetadataKey, attrs, target);
}

export default abstract class BaseModel {

    /**
     * 获取数据字段数组
     */
    static get attrNames() {
        if (this._attrNames) return this._attrNames;
        const arr: string[] = [];
        let target: any = this;
        let stop = false;
        while (!stop) {
            const data = Reflect.getMetadata(attrsMetadataKey, target.prototype);
            arr.push(...data);
            if (target.constructor === BaseModel) {
                stop = true;
            } else {
                const nextTarget = target.__proto__;
                if (!nextTarget || nextTarget === target) {
                    stop = true;
                } else {
                    target = nextTarget;
                }
            }
        }
        this._attrNames = arr;

        return arr;
    }

    get isEmpty() {
        return this.size.h === 0 || this.size.w === 0;
    }

    public static type: string;

    private static _attrNames: string[];


    get frame() {
        return {
            ...this.postion,
            ...this.size
        };
    }

    /**
     * 元素锚点
     */
    @attr
    public  anchor: IPostion = { x: 0, y: 0 };

    /**
     * 是否冻结, 是否不可操作
     */
    @attr
    public frozen: boolean = false;

    /**
     * 是否可见
     */
    @attr
    public visible: boolean = true;

    /**
     * 元素定位
     *
     * @abstract
     * @type {IPostion}
     * @memberof BaseView
     */
    public abstract postion: IPostion;


    public abstract padding: { top: number; left: number; right: number; bottom: number };

    /**
     * 图形宽高
     *
     * @abstract
     * @type {ISize}
     * @memberof BaseView
     */
    public abstract size: ISize;

    /**
     * 线条颜色
     *
     * @type {string}
     * @memberof BaseModel
     */
    public strokeColor: string = '#fff';

    /**
     * 线宽
     *
     * @type {number}
     * @memberof BaseModel
     */
    @attr
    public lineWidth: number = 0;

    /**
     * 设置或返回线条末端线帽的样式
     *
     * @type {('butt' | 'round' | 'square')}
     * @memberof BaseModel
     */
    @attr
    public lineCap: 'butt' | 'round' | 'square' = 'round';

    /**
     * 属性设置或返回所创建边角的类型，当两条线交汇时。
     *
     * @type {('bevel' | 'round' | 'miter')}
     * @memberof BaseModel
     */
    @attr
    public lineJoin: 'bevel' | 'round' | 'miter' = 'round';

    /**
     *
     * 不透明度
     * @type {number}
     * @memberof BaseView
     */
    public opacity: number = 1;
}
