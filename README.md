# livas
具有响应式特性的canvas库

### 设计思路
分成layer和view层
layer: 专注于图形渲染, 一个layer可以有多个sublayer,
view: view的作用包含处理事件,碰撞检测, 绘制layer, 持有一个rootLayer, view也有subView的概念
渲染实现:
* 每个layer都可以选择是否是用cache, 是用cache的话会专门创建一个离屏canvas,由view提供
* 虽然layer有sublayer, 但是实际渲染的时候并没上下级关系,都是同级,只不过渲染的时候顺序不同
* 每个layer最后实际渲染时的transform是需要根据父层的transform计算出来
