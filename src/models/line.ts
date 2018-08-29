/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-29 11:38:06
 */
import BrushModel from './brush';
import { IPostion } from '../types/postion';


 export default class LineModel extends BrushModel {


    public static type = 'line';

    public useCache = true;


    get startPostion() {
        return this.postions[0];
    }

    set startPostion(value: IPostion) {
        this.postions[0] = value;
    }

    get endPostion() {
        return this.postions[1];
    }

    set endPostion(value: IPostion) {
        this.postions[1] = value;
    }
 }
