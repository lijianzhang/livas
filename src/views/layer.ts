import BaseView from '../views/base';

export default class Layer {
    private views: BaseView[] = [];

    public addSubView(view: BaseView) {
        this.views.push(view);
    }
}
