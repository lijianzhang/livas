/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 18:21:26
 */
import BaseModel, { attr } from './base';
import { IPostion, ISize } from '../types/postion';


 export default class ShapeModel extends BaseModel {

    @attr
    public postion: IPostion = { x: 0, y: 0 };

    @attr
    public size: ISize = { w: 0, h: 0 };

    /**
     * 填充的颜色
     *
     * @type {string}
     * @memberof ShapeModel
     */
    @attr
    public fillColor: string = '#fff';

    /**
     * 是否填充
     *
     * @type {boolean}
     * @memberof ShapeModel
     */
    @attr
    public isFill: boolean = false;

    get padding() {
        const w = Math.floor(this.lineWidth / 2);

        return {
            top: w,
            left: w,
            bottom: w,
            right: w
        };
    }

    /**
     * 边框样式, 类似css
     */
    @attr
    public border: {
        width: number;
        style:  'solid' | 'dashed' ;
        color: string;
        radius: number;
    } = { width: 0, style: 'solid', color: '', radius: 0 };

 }
