/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 15:05:32
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-08-28 17:44:44
 */
import BrushModel from './brush';


 export default class LineModel extends BrushModel {


    public static type = 'line';

    public useCache = true;


    get startPostion() {
        return this.postions[0];
    }

    get endPostion() {
        return this.postions[1];
    }
 }
