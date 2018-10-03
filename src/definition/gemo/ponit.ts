/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 00:28:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-02 23:41:28
 */
declare namespace Livas.gemo {
    /**
     * 点
     *
     * @export
     * @interface IPoint
     */
    export interface IPoint {
        /**
         * 相对于父级画布的x轴位置
         *
         * @type {number}
         * @memberof IBaseLayer
         */
        x: number;

        /**
         * 相对于父级画布的y轴位置
         *
         * @type {number}
         * @memberof IBaseLayer
         */
        y: number;
    }
}
