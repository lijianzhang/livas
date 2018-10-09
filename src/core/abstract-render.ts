/*
 * @Author: lijianzhang
 * @Date: 2018-10-03 01:39:15
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-10-03 01:44:47
 */


export default abstract class AbstractRender implements Livas.IRender {
    public abstract draw(view: Livas.IView);
}
