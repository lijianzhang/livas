import 'reflect-metadata';
import { IPostion, ISize } from '../types';
import { observable, Observer } from 'liob';

export { computed, observable } from 'liob';

/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 14:18:55
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-04 23:08:04
 */
const attrsMetadataKey = Symbol('attrs');

let id = 0;

/**
 * 标记属性字段
 * @param target BaseView
 * @param key 字段名
 */
export function attr<T extends BaseView>(target: T, key: string, descriptor?: PropertyDescriptor) {
    const attrs = Reflect.getOwnMetadata(attrsMetadataKey, target) || [];
    if (!descriptor) observable(target, key);
    attrs.push(key);
    Reflect.defineMetadata(attrsMetadataKey, attrs, target);
}

export default abstract class BaseView {

    /**
     * 获取与需要序列化的字段数组
     */
    static get attrNames() {
        if (this._attrNames) return this._attrNames;
        const arr: string[] = [];
        let target: any = this.prototype;
        let stop = false;

        while (!stop) {
            const data = Reflect.getMetadata(attrsMetadataKey, target);
            arr.push(...data);
            if (target.constructor === BaseView) {
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

    private static _attrNames: string[];

    constructor() {
        id += 1;
        this.id = id;
        this.$observer = new Observer(() => {
            this.forceUpdate();
        }, `${this.constructor.name}.render()`);
    }


    /**
     * view的类型, 需要根据不同type渲染不同的view
     *
     * @abstract
     * @type {string}
     * @memberof BaseView
     */
    @attr
    public abstract type: string;

    /**
     * 元素锚点
     */
    @attr
    public  anchor: [number, number] = [0.5, 0.5];

    /**
     * 是否冻结, 是否不可操作
     */
    @attr
    public frozen: boolean = false;

    /**
     * 缩放比例
     */
    @attr
    public scale: [number, number] = [1, 1];

    @attr
    public skew: [number, number] = [0, 0];

    @attr
    public rotate: number = 0;

    @attr
    public translate: [number, number] = [0, 0];

    /**
     * 是否可见
     */
    @attr
    public visible: boolean = true;

    /**
     * 元素定位, 这个定位是相对于父元素
     *
     * @abstract
     * @type {IPostion}
     * @memberof BaseView
     */
    public abstract postion: IPostion;


    /**
     * 元素的内边距
     *
     * @type {{ top: number; left: number; right: number; bottom: number }}
     * @memberof BaseView
     */
    public  padding?: { top: number; left: number; right: number; bottom: number };

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
    @attr
    public color: string = '';

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
    @attr
    public opacity: number = 1;

    public $observer: Observer;

    public id: number;

    get attrNames() {
        return (this.constructor as typeof BaseView).attrNames;
    }

    get isEmpty() {
        return this.size.h === 0 || this.size.w === 0;
    }



    public toJSON() {
        const attrNames = this.attrNames;
        const obj: any = {};
        for (let index = 0; index < attrNames.length; index += 1) {
            const value = this[attrNames[index]];
            if (value !== undefined && value !== '' && value !== null) {
                obj[attrNames[index]] = value;
            }
        }

        return obj;
    }

    public toData() {
        try {
            return JSON.parse(JSON.stringify(this));
        } catch (error) {
            throw error;
        }
    }

    public abstract forceUpdate(): void;
}
