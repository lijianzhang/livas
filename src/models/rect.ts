import BaseModel, { attr } from './base';
import { observable } from 'liob';

@observable
export default class RectModel extends BaseModel {

    /**
     * 边框样式, 类似css
     */
    @attr
    public readonly border: {
        width: number;
        style:  'solid' | 'dashed' ;
        color: string;
        radius: number;
    } = { width: 0, style: 'solid', color: '', radius: 0 };

}
