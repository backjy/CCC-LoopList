# LoopList 【[git链接](https://github.com/backjy/CCC-LoopList.git)】
* 这个控件是一个都比较常用的控件 在ios 上就是类似的就是[UITableView](https://developer.apple.com/documentation/uikit/uitableview)，当大量重复的item 被添加ScrollView上时必然造成性能上的问题，所以就需要用到重复循环利用显示节点来提高性能。
* 在cocos 上已经有大佬做了相同的东西了[List](https://forum.cocos.org/t/scrollview-item-drawcall/79055/160)做的很完善,  我这个LoopList 实现思路和他有些区别，不用去记录item 的 width| height
  
## 实现思路
* 之前也做个类似的，但是都涉及到如果item width|height 可变的情况下 如果参考UITableView 的设计方式都需要涉及到记录每个index item的 width|height。 之前Unity 的时候自己也写过，但是后来朋友介绍了一个叫SuperScrollView 的第三方插件试用后果断删了自己写的哪个东西。
  
* 通过阅读 [cc.ScrollView](https://github.com/cocos-creator/engine/blob/master/cocos2d/core/components/CCScrollView.js) 找到了 _getHowMuchOutOfBoundary 这个函数, 这个函数就是当content 位置移动完成后ScrollView来查询 上下左右边界的东西，通过测试后发现也是这样的逻辑
  
* 那么实现新的UITableView 就可以抛弃宽高记录，于是就有了新的LoopList。 通过计算 item 相对于显示范围的位置来添加，删除（放入循环pool）item，差不多700行做完了基本上都写了注释。

* 回收逻辑：当顶部或左边的 item 移动超出显示范围上或左边一定距离的时候就回收该 item ，同理当底部或右边 item 超出显示范围一定距离后就回收该item。

* 创建逻辑：当顶部或左边的item 的顶部或左边小于显示范围顶部或左边一定距离时就需要创建一个新的item 置于list 顶部或左边，同理底部和后边一样处理。
  
## 已经实现的功能
* 基础的item 创建回收循环
* 多类型item 创建回收循环
* 单帧最大创建数控制
* item 动态高或宽
* item 的padding（也就是item 之间的间距）
* item 不修改位置刷新
* 无动画显示指定index 的item
* 滑动到指定 index 的item

## 使用方式
### Editor 中的注意事项
* 创建一个ScrollView 然后添加一个LoopList 组件
* 在 ScrollView 的 content 下添加需要的item 原型，并对其添加LoopListItem 组件（对于该组件可以继承添加一些自己的属性） 注意：横向的Item 注意一下锚点x请用0，竖向的item 注意锚点y设置为1。
* 调整 遮罩层的位置 最好是用的widget 免得麻烦。（scrollView 都需要调整viewport）
* 在creator.d.ts 的ScrollView 加上 \[x:string\]:any 避免typescript 中报错
  
### 代码中使用方式
* 调用list 的initialize函数 传入创建函数，以及默认初始化item个默认为0
* setItemCount  设置当前item count 如果不是强制Reset
    那么大于等于当前itemcout || 最后一项item不是当前item 自动使用刷新方式不会修改当前item 的显示位置
* refreshItems 重新创建当前已经创建的item，位置不变
* showItem 直接显示指定index 的item

## TODO
* page view （感觉直接用cc.PageView，不是很必须）
* grid view （这个如果一行高度都固定的直接用一排里面方几个就可以了， 特殊的瀑布了那种没想通的是 item size 有改变后回到顶部会出现对不齐的情况该咋办没想好咋处理）
* 下拉刷新，上拉刷新 （这个比较简单 给_getContentLeftBoundary 这4个函数对应的添加一个 offset 偏移量就和触发点就ok了）
* scrollbar的控制接入（这个优先级很低）

