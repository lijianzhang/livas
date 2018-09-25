/*
 * @Author: lijianzhang
 * @Date: 2018-09-25 15:32:46
 * @Last Modified by: lijianzhang
 * @Last Modified time: 2018-09-25 15:47:14
 */

 export default class Layer {
     public superLayer?: Layer;

     public subLayers: Layer[] = [];

     public x: number;
     public y: number;
     public w: number;
     public h: number;

     public backgroundColor: string;
 }
