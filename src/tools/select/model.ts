import GlobalStore from "../../models/global-store";
import BaseModel from "../../models/base";


export default class SelectModel extends BaseModel {
    constructor(store: GlobalStore) {
        super();
        this.store = store;
    }

    store: GlobalStore;

    get postion() {
        if (this.store.currentView) {
            return this.store.currentView.data.postion;
        }
        return {x: 0, y: 0};
    }

    get size() {
        if (this.store.currentView) {
            return this.store.currentView.data.size;
        }
        return {w: 0, h: 0};
    }

    get padding() {
        if (this.store.currentView) {
            return this.store.currentView.data.padding;
        }
        return {left: 0, right: 0, top: 0, bottom: 0};
    }
}