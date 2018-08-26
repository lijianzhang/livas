import { observable } from 'liob';
import Base from './base';

@observable
export default class Line extends Base {
    pos: { x: number, y: number }[] = [];
}