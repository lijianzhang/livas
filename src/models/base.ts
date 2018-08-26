/*
 * @Author: lijianzhang
 * @Date: 2018-08-26 13:46:46
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-27 00:38:30
 */
import 'reflect-metadata';
import { IPostion, ISize } from "../types/postion";

const attrsMetadataKey = Symbol('attrs');

export function attr(target: any, key: string) {
    const attrs = Reflect.getOwnMetadata(attrsMetadataKey, target) || [];
    attrs.push(key);
    Reflect.defineMetadata(attrsMetadataKey, attrs, target);
};


export default class BaseModel {
    /**
     * 元素坐标
     */
    @attr
    public postion: IPostion = { x: 0, y: 0 };

    /**
     * 元素尺寸
     */
    @attr
    public size: ISize = { w: 0, h: 0 };

    /**
     * 元素锚点
     */
    @attr
    public  anchor: IPostion = { x: 0, y: 0 }

    /**
     * 线框颜色
     */
    @attr
    public strokeColor = '#000';

    /**
     * 线框连接点形状
     */
    @attr
    public lineCap: string = 'round';

    @attr
    public lineJoin: string = 'round';


    /**
     * 线宽
     */
    @attr
    public lineWidth: number = 1;

    /**
     * 不透明度
     */
    @attr
    public opacity: number = 1;


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

    private _attrNames!: string[];

    get attrNames() {
        if (this._attrNames) return this._attrNames;
        const arr: string[] = [];
        (window as any).a = this;
        let target: any = this;
        let stop = false;
        while(!stop) {
            const data = Reflect.getMetadata(attrsMetadataKey, target);
            arr.push(...data);
            if (target.constructor === BaseModel) {
                stop = true
            } else {
                const nextTarget = (target as any).__proto__.__proto__;
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


    /**
     * 背景色
     */
    public backgroundColor: string = '';

    set<T extends keyof this>(key: T, value: this[T]) {
        this[key]= value;
    }
}