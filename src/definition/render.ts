/*
 * @Author: lijianzhang
 * @Date: 2018-10-02 00:28:56
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 01:43:14
 */
declare namespace Livas {
    export interface IRender {
       draw<T extends IView>(view: T): void;
    }
}
