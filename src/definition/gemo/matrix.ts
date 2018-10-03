/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 17:02:13
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 02:27:10
 */

declare namespace Livas.gemo {
    export interface IMatrix {
        /**
         * x轴的scale值
         *
         * @type {number}
         * @memberof IMatrix
         */
        a: number;
        /**
         * y轴的skew值
         *
         * @type {number}
         * @memberof IMatrix
         */
        b: number;

        /**
         * x轴的skew值
         *
         * @type {number}
         * @memberof IMatrix
         */
        c: number;

        /**
         * y轴的scale值
         *
         * @type {number}
         * @memberof IMatrix
         */
        d: number;

        /**
         * x轴的偏移值
         *
         * @type {number}
         * @memberof IMatrix
         */
        tx: number;

        /**
         * y轴的偏移值
         *
         * @type {number}
         * @memberof IMatrix
         */
        ty: number;
    }
}

