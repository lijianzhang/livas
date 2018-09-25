/*
 * @Author: lijianzhang
 * @Date: 2018-08-28 21:43:06
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-03 21:00:17
*/

export function getElementOffset(element: HTMLElement) {
    const offset = {
        top: element.offsetTop,
        left: element.offsetLeft
    };
    let parent = element.offsetParent as HTMLElement;

    while (parent !== null) {
        offset.top += parent.offsetTop;
        offset.left += parent.offsetLeft;
        parent = parent.offsetParent as HTMLElement;
    }

    return offset;
}
