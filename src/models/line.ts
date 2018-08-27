import { observable } from 'liob';
import Base, { attr } from './base';

@observable
export default class Line extends Base {
    @attr
    public pos: { x: number; y: number }[] = [];
}
