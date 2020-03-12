
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/looplist/LoopList.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'f35ea5qkPhMwLfRp4mx+aML', 'LoopList');
// looplist/LoopList.ts

Object.defineProperty(exports, "__esModule", { value: true });
var LoopListItem_1 = require("./LoopListItem");
var EPSILON = 1e-4;
1;
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, disallowMultiple = _a.disallowMultiple;
var LoopList = /** @class */ (function (_super) {
    __extends(LoopList, _super);
    function LoopList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cacheBoundary = 200;
        _this.frameCreateMax = 30;
        /// item 缓存池
        _this._itemPool = null;
        _this._templates = {};
        _this._template = null; /// 默认使用的prefab
        _this._itemCreator = null;
        _this._totalcount = 0;
        /// current display item
        _this._items = [];
        /// max padding 区分回收边界和创建边界 避免padding 造成的重复创建和回收
        _this._maxPadding = 0;
        /// recycle & create item boundary
        _this.leftBoundary = 0;
        _this.rightBoundary = 0;
        _this.topBoundary = 0;
        _this.bottomBoundary = 0;
        /// 直接展示item 到idx
        _this.animeIdx = 0;
        _this.bAnimeMoveing = false;
        _this._itemSizeDirty = true;
        _this._itemDirty = false;
        return _this;
    }
    Object.defineProperty(LoopList.prototype, "viewPort", {
        /// 视口
        get: function () { return this.content.parent; },
        enumerable: true,
        configurable: true
    });
    LoopList.prototype.onLoad = function () {
        /// 只允许一个方向
        this.horizontal = this.vertical ? false : true;
        if (this.content) {
            /// initialize content view
            var anch = this.horizontal ? cc.v2(0, 0.5) : cc.v2(0.5, 1);
            this.content.setAnchorPoint(anch);
            this.content.setPosition(cc.Vec2.ZERO);
        }
        /// initialize data
        this._calculateBoundary();
    };
    LoopList.prototype.onEnable = function () {
        _super.prototype.onEnable.call(this);
        this.node.on("scrolling", this.onScrolling, this);
    };
    LoopList.prototype.onDisable = function () {
        _super.prototype.onDisable.call(this);
        this.node.off("scrolling", this.onScrolling, this);
    };
    /// initialize total count, item creator
    LoopList.prototype.initialize = function (creator, count) {
        if (count === void 0) { count = 0; }
        this._totalcount = count || 0;
        this._itemCreator = creator;
        this._initializePool();
        this._updateListView();
    };
    /// 设置当前item count 如果不是强制Reset
    /// 那么大于等于当前itemcout || 最后一项item不是 当前item 自动使用刷新方式不会修改当前item 的显示位置
    LoopList.prototype.setItemCount = function (count, bReset) {
        if (bReset === void 0) { bReset = false; }
        if (bReset) {
            this.setContentPosition(cc.Vec2.ZERO);
            this._totalcount = count;
            this.showItem(0);
        }
        else {
            var oldcount = this._totalcount;
            this._totalcount = count;
            /// 如果新的item count 大于 oldItemcount那么大于等于当前itemcout
            var lastItem = this._items.length > 0 ? this._items[this._items.length - 1] : null;
            if (count >= oldcount || (lastItem != null && lastItem.itemIdx < (count - 1))) {
                this.refreshItems();
            }
            else {
                this.showItem(count - 1);
            }
        }
    };
    /// 刷新当前所有item
    LoopList.prototype.refreshItems = function () {
        if (this._totalcount > 0 && this._items.length > 0) {
            var fristItem = this._items[0];
            var pos = fristItem.node.position;
            var itemIdx = fristItem.itemIdx;
            /// create top item
            this._recycleAllItems();
            var arg = this.horizontal ? pos.x : pos.y;
            this._updateListView(itemIdx, arg);
        }
        else {
            this._recycleAllItems(true);
            this._updateListView();
        }
    };
    LoopList.prototype.showItem = function (idx, bAnime) {
        if (bAnime === void 0) { bAnime = false; }
        // 限定到 0 - （totalcount -1）范围内
        idx = Math.min(this._totalcount - 1, Math.max(0, idx));
        if (bAnime) {
            this.animeIdx = idx;
            this.bAnimeMoveing = true;
        }
        else {
            /// 回收所有items 从新创建top item
            if (this.horizontal) {
                this._showItemHor(idx);
            }
            else {
                this._showItemVer(idx);
            }
            /// 检查是否需要回滚位置
        }
    };
    /// 获取一个item 
    LoopList.prototype.getItem = function (key) {
        if (key === void 0) { key = null; }
        key = key || this._template;
        var pool = this._itemPool[key];
        var instance = (pool && pool.length > 0) ? pool.pop() : null;
        if (instance == null) {
            var prefab = this._templates[key];
            if (prefab != null) {
                var node = cc.instantiate(prefab.node);
                instance = node.getComponent(LoopListItem_1.default);
                instance.itemKey = key;
            }
        }
        return instance;
    };
    LoopList.prototype.itemSizeChanged = function () {
        this._itemSizeDirty = true;
    };
    LoopList.prototype.onScrolling = function () {
        this._itemDirty = true;
    };
    LoopList.prototype.update = function (dt) {
        _super.prototype.update.call(this, dt);
        if (this._itemSizeDirty) {
            this._itemSizeDirty = false;
            if (this.horizontal) {
                this._updateHorizontalItems();
            }
            else {
                this._updateVerticalItems();
            }
        }
        if (this._itemDirty) {
            this._itemDirty = false;
            this._updateListView();
        }
        /// 动画移动
        this.bAnimeMoveing = this._scro;
        if (this.bAnimeMoveing) {
            if (this.horizontal) {
                this._animeShowItemHor(this.animeIdx);
            }
            else {
                this._animeShowItemVer(this.animeIdx);
            }
        }
    };
    LoopList.prototype._initializePool = function () {
        var _this = this;
        if (this._itemPool == null) {
            this._itemPool = {};
            var prefabs = this.getComponentsInChildren(LoopListItem_1.default);
            prefabs.forEach(function (item) {
                /// save templates 
                var key = item.itemKey = item.node.name;
                _this._template = _this._template == null ? key : _this._template;
                _this._templates[key] = item;
                _this._maxPadding = Math.max(_this._maxPadding, item.padding + 2);
                _this._recycle(item);
            });
        }
    };
    LoopList.prototype._showItemVer = function (idx) {
        /// 判断第一个和最后一个都在窗口内就不用执行了
        var frist = this._items[0];
        var last = this._items[this._items.length - 1];
        if (frist.itemIdx === 0 && last.itemIdx === (this._totalcount - 1) &&
            this._getItemTop(frist) <= this._topBoundary &&
            this._getItemBottom(last) >= this._bottomBoundary) {
            return;
        }
        /// 回收当前所有item & reset content position
        this._recycleAllItems(true);
        if (this._updateListView(idx)) {
            /// 判断最后一条是否在窗口内部需要靠窗口底部
            var item = this._items[this._items.length - 1];
            if (item.itemIdx === (this._totalcount - 1)) {
                var bottom = this._getItemBottom(item);
                if (bottom > this._bottomBoundary) {
                    this.content.y = this._bottomBoundary - bottom;
                    /// 移动窗口后需要重新加载顶部item &
                    /// 判断 topitem 是否在顶部边界里面去了
                    if (this._updateListView()) {
                        var titem = this._items[0];
                        if (titem.itemIdx === 0) {
                            var top = this._getItemTop(titem);
                            if (top < this._topBoundary) {
                                this.content.y = this.content.y + (this._topBoundary - top);
                                /// 标记item 需要重新创建回收
                                this._itemDirty = true;
                            }
                        }
                    }
                }
            }
        }
    };
    LoopList.prototype._showItemHor = function (idx) {
        /// 判断第一个和最后一个都在窗口内就不用执行了
        var frist = this._items[0];
        var last = this._items[this._items.length - 1];
        if (frist.itemIdx === 0 && last.itemIdx === (this._totalcount - 1) &&
            this._getItemLeft(frist) >= this._leftBoundary &&
            this._getItemRight(last) <= this._rightBoundary) {
            return;
        }
        /// 回收当前所有item & reset content position
        this._recycleAllItems(true);
        if (this._updateListView(idx)) {
            /// 判断最后一条是否在窗口内部需要靠窗口右边
            var item = this._items[this._items.length - 1];
            if (item.itemIdx === (this._totalcount - 1)) {
                var right = this._getItemRight(item);
                if (right < this._rightBoundary) {
                    this.content.x = this._rightBoundary - right;
                    /// 判断 leftitem 是否在左边界边界里面去了
                    if (this._updateListView()) {
                        var titem = this._items[0];
                        if (titem.itemIdx === 0) {
                            var left = this._getItemLeft(titem);
                            // console.log("create left items!", left, )
                            if (left > this._leftBoundary) {
                                this.content.x = this.content.x - (left - this._leftBoundary);
                                /// 标记item 需要重新创建回收
                                this._itemDirty = true;
                            }
                        }
                    }
                }
            }
        }
    };
    LoopList.prototype._animeShowItemVer = function (idx) {
    };
    LoopList.prototype._animeShowItemHor = function (idx) {
    };
    LoopList.prototype._recycle = function (item) {
        var pool = this._itemPool[item.itemKey];
        if (pool == null) {
            pool = this._itemPool[item.itemKey] = [];
        }
        item.node.active = false;
        item.looplist = null;
        pool.push(item);
    };
    LoopList.prototype._recycleAllItems = function (reset) {
        var _this = this;
        if (reset === void 0) { reset = false; }
        this._items.forEach(function (item) {
            _this._recycle(item);
        });
        this._items = [];
        if (reset) {
            this.stopAutoScroll();
            this.content.position = cc.Vec2.ZERO;
        }
    };
    LoopList.prototype._createNewItem = function (idx) {
        if (idx < 0 || idx >= this._totalcount)
            return null;
        var item = this._itemCreator ? this._itemCreator(this, idx) : null;
        if (item != null) {
            item.node.position = cc.Vec2.ZERO;
            item.itemIdx = idx;
            item.node.active = true;
            item.looplist = this;
            item.node.parent = this.content;
        }
        return item;
    };
    LoopList.prototype._getItemAt = function (idx) {
        for (var i = 0; i < this._items.length; i++) {
            var item = this._items[i];
            if (item.itemIdx == idx) {
                return item;
            }
        }
        return null;
    };
    LoopList.prototype._getItemTop = function (item) {
        return item.node.y + this.content.y;
    };
    LoopList.prototype._getItemBottom = function (item) {
        var itemtop = this._getItemTop(item);
        return itemtop - item.node.height;
    };
    LoopList.prototype._getItemLeft = function (item) {
        return item.node.x + this.content.x; // + item.offset
    };
    LoopList.prototype._getItemRight = function (item) {
        var itemLeft = this._getItemLeft(item);
        return itemLeft + item.node.width;
    };
    LoopList.prototype._updateListView = function (idx, pos) {
        if (idx === void 0) { idx = 0; }
        if (pos === void 0) { pos = null; }
        /// recycle all items
        if (this._totalcount == 0 && this._items.length > 0) {
            this._recycleAllItems(true);
            return false;
        }
        /// cur count
        if (this._items.length === 0) {
            var item = this.horizontal ? this._createLeftItem(idx, pos) : this._createTopItem(idx, pos);
            if (item == null) {
                return false;
            }
        }
        /// create other items
        var checkcount = 0;
        var call = this.horizontal ? this._updateHorizontal : this._updateVertical;
        while (call.call(this)) {
            if (++checkcount >= this.frameCreateMax) {
                this._itemDirty = true;
            }
        }
        return true;
    };
    LoopList.prototype._createTopItem = function (idx, y) {
        if (y === void 0) { y = null; }
        var item = this._createNewItem(idx);
        if (item) {
            if (y == null) {
                item.node.y = -this._getItemTop(item) + this._topBoundary - item.offset;
            }
            else {
                item.node.y = y;
            }
            this._items.push(item);
        }
        return item;
    };
    /// 从新排序items
    LoopList.prototype._updateVerticalItems = function () {
        if (this._items.length > 1) {
            var pitem = this._items[0];
            for (var idx = 1; idx < this._items.length; idx++) {
                var item = this._items[idx];
                item.node.y = pitem.node.y - pitem.node.height - item.padding;
                pitem = item;
            }
        }
    };
    LoopList.prototype._updateVertical = function () {
        // if( this._checkRecycle() ) { return false}
        // /// fill up & fill down
        var curCount = this._items.length;
        // if( curCount === 0) {
        //     let item = this._createTopItem(0)
        //     return item != null
        // }
        /// recycle top item 回收顶部数据 如果最底下的item 是最后一条那么不回收上面的item
        var topitem = this._items[0];
        var bottomitem = this._items[curCount - 1];
        var bottom_bottom = this._getItemBottom(bottomitem);
        if (curCount > 1) {
            /// recycle top item
            var canRecycleTop = (bottomitem.itemIdx !== this._totalcount - 1 || bottom_bottom < this._bottomBoundary);
            if (canRecycleTop && this._getItemBottom(topitem) > (this.topboundary + this._maxPadding)) {
                this._preItemPadding = topitem.padding;
                this._items.splice(0, 1);
                this._recycle(topitem);
                return true;
            }
            /// recycle bottom item
            if (topitem.itemIdx > 0 && this._getItemTop(bottomitem) < (this.bottomboundary - this._maxPadding)) {
                this._items.splice(curCount - 1, 1);
                this._recycle(bottomitem);
                return true;
            }
        }
        /// create top item
        if (this._getItemTop(topitem) < this.topboundary) {
            var item = this._createNewItem(topitem.itemIdx - 1);
            if (item) {
                item.node.y = topitem.node.y + item.padding + item.node.height;
                this._items.splice(0, 0, item);
                return true;
            }
        }
        /// create bottom item
        if (bottom_bottom > this.bottomboundary) {
            var item = this._createNewItem(bottomitem.itemIdx + 1);
            if (item) {
                item.node.y = bottomitem.node.y - bottomitem.node.height - bottomitem.padding;
                this._items.push(item);
                return true;
            }
        }
        return false;
    };
    LoopList.prototype._createLeftItem = function (idx, x) {
        if (x === void 0) { x = null; }
        var item = this._createNewItem(idx);
        if (item) {
            if (x == null) {
                item.node.x = -this._getItemLeft(item) + this._leftBoundary + item.offset;
            }
            else {
                item.node.x = x;
            }
            this._items.push(item);
        }
        return item;
    };
    LoopList.prototype._updateHorizontalItems = function () {
        if (this._items.length > 1) {
            var preitem = this._items[0];
            for (var idx = 1; idx < this._items.length; idx++) {
                var item = this._items[idx];
                item.node.x = preitem.node.x + preitem.node.height + item.padding;
                preitem = item;
            }
        }
    };
    LoopList.prototype._updateHorizontal = function () {
        // if( this._checkRecycle()) { return false}
        var curCount = this._items.length;
        // if( curCount == 0) {
        //     let item = this._createLeftItem(0)
        //     return item != null? true: false
        // }
        /// fill left & fill right
        var leftItem = this._items[0];
        var rightItem = this._items[curCount - 1];
        var right_right = this._getItemRight(rightItem);
        if (curCount > 1) {
            /// recycle left item
            var canRecycleLeft = (rightItem.itemIdx !== (this._totalcount - 1) || right_right > this.rightboundary);
            if (canRecycleLeft && this._getItemRight(leftItem) < (this.leftboundary - this._maxPadding)) {
                this._preItemPadding = leftItem.padding;
                this._items.splice(0, 1);
                this._recycle(leftItem);
                return true;
            }
            /// recycle right item
            if (leftItem.itemIdx > 0 && this._getItemLeft(rightItem) > (this.rightboundary + this._maxPadding)) {
                this._items.splice(curCount - 1, 1);
                this._recycle(rightItem);
                return true;
            }
        }
        /// create left item
        if (this._getItemLeft(leftItem) > this.leftboundary) {
            var item = this._createNewItem(leftItem.itemIdx - 1);
            if (item) {
                item.node.x = leftItem.node.x - item.node.width - item.padding;
                this._items.splice(0, 0, item);
                return true;
            }
        }
        /// create bottom item
        if (right_right < this.rightboundary) {
            var item = this._createNewItem(rightItem.itemIdx + 1);
            if (item) {
                item.node.x = rightItem.node.x + rightItem.node.width + rightItem.padding;
                this._items.push(item);
                return true;
            }
        }
    };
    //// 下面的函数都是重写scrollview 原有的函数
    //// stop anime moveing on touch began
    LoopList.prototype._onTouchBegan = function (event, captureListeners) {
        _super.prototype._onTouchBegan.call(this, event, captureListeners);
        if (event.isStopped) {
            this.bAnimeMoveing = false;
        }
    };
    /// 计算边界
    LoopList.prototype._calculateBoundary = function () {
        if (this.content) {
            this.content.setContentSize(cc.size(this.viewPort.width, this.viewPort.height));
            /// view port
            var viewSize = this.viewPort.getContentSize();
            var anchorX = viewSize.width * this.viewPort.anchorX;
            var anchorY = viewSize.height * this.viewPort.anchorY;
            /// 计算上下左右边界
            this._leftBoundary = -anchorX;
            this._bottomBoundary = -anchorY;
            this._rightBoundary = this._leftBoundary + viewSize.width;
            this._topBoundary = this._bottomBoundary + viewSize.height;
            /// 计算回收边界
            this.leftboundary = this._leftBoundary - this.cacheBoundary;
            this.rightboundary = this._rightBoundary + this.cacheBoundary;
            this.topboundary = this._topBoundary + this.cacheBoundary;
            this.bottomboundary = this._bottomBoundary - this.cacheBoundary;
        }
    };
    /// 裁剪移动量
    LoopList.prototype._clampDelta = function (delta) {
        return this._items.length > 0 ? delta : cc.Vec2.ZERO;
    };
    /// 重写该函数实现左边界回弹 
    /// pageView 也可以在这里实现 & 通过判断当前正在viewport 的第一个item 然后返回该item 的与LeftBounddary的关系
    LoopList.prototype._getContentLeftBoundary = function () {
        if (this._items.length > 0) {
            var item = this._items[0];
            if (item.itemIdx === 0) {
                return this._getItemLeft(item) - item.offset;
            }
        }
        return this._leftBoundary;
    };
    /// 重写该函数实现右边界回弹
    LoopList.prototype._getContentRightBoundary = function () {
        if (this._items.length > 0) {
            var item = this._items[this._items.length - 1];
            if (item.itemIdx === (this._totalcount - 1)) {
                return this._getItemRight(item);
            }
        }
        return this._rightBoundary;
    };
    /// 重写该函数实现上边界回弹
    /// pageView 也可以在这里实现 & 通过判断当前正在viewport 的第一个item 然后返回该item 的与LeftBounddary的关系
    LoopList.prototype._getContentTopBoundary = function () {
        if (this._items.length > 0) {
            var item = this._items[0];
            if (item.itemIdx === 0) {
                return this._getItemTop(item) + item.offset;
            }
        }
        return this._topBoundary;
    };
    /// 重写该函数实现下边界回弹
    LoopList.prototype._getContentBottomBoundary = function () {
        if (this._items.length > 0) {
            var item = this._items[this._items.length - 1];
            if (item.itemIdx === (this._totalcount - 1)) {
                return this._getItemBottom(item);
            }
        }
        return this._bottomBoundary;
    };
    // 重写该函数实现边界回弹
    LoopList.prototype._getHowMuchOutOfBoundary = function (addition) {
        addition = addition || cc.v2(0, 0);
        // 注释这行会造成回弹bug
        if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }
        var outOfBoundaryAmount = cc.v2(0, 0);
        if (this.horizontal) {
            /// 水平模式左右边界
            outOfBoundaryAmount.y = 0;
            var left = this._getContentLeftBoundary() + addition.x;
            var right = this._getContentRightBoundary() + addition.x;
            if (left > this._leftBoundary) {
                outOfBoundaryAmount.x = this._leftBoundary - left;
            }
            else if (right < this._rightBoundary) {
                outOfBoundaryAmount.x = this._rightBoundary - right;
                var temp = left + outOfBoundaryAmount.x;
                if (this._items.length > 0 && this._items[0].itemIdx === 0 && temp >= this._leftBoundary) {
                    outOfBoundaryAmount.x = this._leftBoundary - left;
                }
            }
        }
        else {
            ///  垂直模式上下边界
            outOfBoundaryAmount.x = 0;
            var top = this._getContentTopBoundary() + addition.y;
            var bottom = this._getContentBottomBoundary() + addition.y;
            if (top < this._topBoundary) {
                outOfBoundaryAmount.y = this._topBoundary - top;
            }
            else if (bottom > this._bottomBoundary) {
                outOfBoundaryAmount.y = this._bottomBoundary - bottom;
                /// 判断第一条item 落下来是否会超过 topboundary 如果超过要重新计算
                var temp = top + outOfBoundaryAmount.y;
                if (this._items.length > 0 && this._items[0].itemIdx === 0 && temp <= this._topBoundary) {
                    outOfBoundaryAmount.y = this._topBoundary - top;
                }
            }
        }
        /// ？？？
        if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }
        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);
        return outOfBoundaryAmount;
    };
    __decorate([
        property(cc.Float)
    ], LoopList.prototype, "cacheBoundary", void 0);
    __decorate([
        property(cc.Integer)
    ], LoopList.prototype, "frameCreateMax", void 0);
    LoopList = __decorate([
        ccclass,
        disallowMultiple(),
        menu("UIExtension/LoopList")
    ], LoopList);
    return LoopList;
}(cc.ScrollView));
exports.default = LoopList;

cc._RF.pop();
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQTJDO0FBRTNDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQztBQUFBLENBQUMsQ0FBQTtBQUVoQixJQUFBLGtCQUEyRCxFQUExRCxvQkFBTyxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLHNDQUFpQyxDQUFDO0FBS2xFO0lBQXNDLDRCQUFhO0lBSG5EO1FBQUEscUVBc21CQztRQTlsQlcsbUJBQWEsR0FBVyxHQUFHLENBQUE7UUFHM0Isb0JBQWMsR0FBVyxFQUFFLENBQUE7UUFFbkMsWUFBWTtRQUNKLGVBQVMsR0FBb0MsSUFBSSxDQUFBO1FBQ2pELGdCQUFVLEdBQWlDLEVBQUUsQ0FBQTtRQUM3QyxlQUFTLEdBQVcsSUFBSSxDQUFBLENBQUMsZUFBZTtRQUN4QyxrQkFBWSxHQUFpRCxJQUFJLENBQUE7UUFDakUsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDL0Isd0JBQXdCO1FBQ2hCLFlBQU0sR0FBbUIsRUFBRSxDQUFBO1FBQ25DLGdEQUFnRDtRQUN4QyxpQkFBVyxHQUFXLENBQUMsQ0FBQTtRQUUvQixrQ0FBa0M7UUFDMUIsa0JBQVksR0FBVyxDQUFDLENBQUE7UUFDeEIsbUJBQWEsR0FBVyxDQUFDLENBQUE7UUFDekIsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDdkIsb0JBQWMsR0FBVyxDQUFDLENBQUE7UUF3RWxDLGlCQUFpQjtRQUNULGNBQVEsR0FBVyxDQUFDLENBQUE7UUFDcEIsbUJBQWEsR0FBWSxLQUFLLENBQUE7UUErQjlCLG9CQUFjLEdBQVksSUFBSSxDQUFBO1FBSzlCLGdCQUFVLEdBQVksS0FBSyxDQUFBOztJQTRkdkMsQ0FBQztJQXZrQkcsc0JBQUksOEJBQVE7UUFEWixNQUFNO2FBQ04sY0FBeUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQSxDQUFBLENBQUM7OztPQUFBO0lBRXBE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QyxZQUFZLEVBQUU7b0JBQ3JGLG1CQUFtQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQTtpQkFDbEQ7YUFDSjtTQUNKO1FBQ0QsT0FBTztRQUNQLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsbUJBQW1CLENBQUM7WUFDaEQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQztTQUMxQztRQUNELG1CQUFtQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUM1RCxPQUFPLG1CQUFtQixDQUFDO0lBQy9CLENBQUM7SUE3bEJEO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7bURBQ2U7SUFHbkM7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztvREFDYTtJQVJsQixRQUFRO1FBSDVCLE9BQU87UUFDUCxnQkFBZ0IsRUFBRTtRQUNsQixJQUFJLENBQUMsc0JBQXNCLENBQUM7T0FDUixRQUFRLENBbW1CNUI7SUFBRCxlQUFDO0NBbm1CRCxBQW1tQkMsQ0FubUJxQyxFQUFFLENBQUMsVUFBVSxHQW1tQmxEO2tCQW5tQm9CLFFBQVEiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9vcExpc3RJdGVtICBmcm9tIFwiLi9Mb29wTGlzdEl0ZW1cIjtcclxuXHJcbmNvbnN0IEVQU0lMT04gPSAxZS00OzFcclxuXHJcbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eSwgbWVudSwgZGlzYWxsb3dNdWx0aXBsZX0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuQGRpc2FsbG93TXVsdGlwbGUoKVxyXG5AbWVudShcIlVJRXh0ZW5zaW9uL0xvb3BMaXN0XCIpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3BMaXN0IGV4dGVuZHMgY2MuU2Nyb2xsVmlldyB7XHJcbiAgICAvLy8gdHPkuK3pmLLmraLorr/pl65jYy5TY3JvbGxWaWV3IOengeacieWxnuaAp+aXtuaKpemUmVxyXG4gICAgW3g6IHN0cmluZ106IGFueTtcclxuICAgIFxyXG4gICAgQHByb3BlcnR5KCBjYy5GbG9hdClcclxuICAgIHByaXZhdGUgY2FjaGVCb3VuZGFyeTogbnVtYmVyID0gMjAwXHJcblxyXG4gICAgQHByb3BlcnR5KCBjYy5JbnRlZ2VyKVxyXG4gICAgcHJpdmF0ZSBmcmFtZUNyZWF0ZU1heDogbnVtYmVyID0gMzBcclxuXHJcbiAgICAvLy8gaXRlbSDnvJPlrZjmsaBcclxuICAgIHByaXZhdGUgX2l0ZW1Qb29sOiB7IFtrZXk6c3RyaW5nXTogTG9vcExpc3RJdGVtW119ID0gbnVsbFxyXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGVzOiB7W2tleTpzdHJpbmddOiBMb29wTGlzdEl0ZW19ID0ge31cclxuICAgIHByaXZhdGUgX3RlbXBsYXRlOiBzdHJpbmcgPSBudWxsIC8vLyDpu5jorqTkvb/nlKjnmoRwcmVmYWJcclxuICAgIHByaXZhdGUgX2l0ZW1DcmVhdG9yOiAoIHZpZXc6IExvb3BMaXN0LCBpZHg6IG51bWJlcik9Pkxvb3BMaXN0SXRlbSA9IG51bGxcclxuICAgIHByaXZhdGUgX3RvdGFsY291bnQ6IG51bWJlciA9IDBcclxuICAgIC8vLyBjdXJyZW50IGRpc3BsYXkgaXRlbVxyXG4gICAgcHJpdmF0ZSBfaXRlbXM6IExvb3BMaXN0SXRlbVtdID0gW11cclxuICAgIC8vLyBtYXggcGFkZGluZyDljLrliIblm57mlLbovrnnlYzlkozliJvlu7rovrnnlYwg6YG/5YWNcGFkZGluZyDpgKDmiJDnmoTph43lpI3liJvlu7rlkozlm57mlLZcclxuICAgIHByaXZhdGUgX21heFBhZGRpbmc6IG51bWJlciA9IDBcclxuXHJcbiAgICAvLy8gcmVjeWNsZSAmIGNyZWF0ZSBpdGVtIGJvdW5kYXJ5XHJcbiAgICBwcml2YXRlIGxlZnRCb3VuZGFyeTogbnVtYmVyID0gMFxyXG4gICAgcHJpdmF0ZSByaWdodEJvdW5kYXJ5OiBudW1iZXIgPSAwXHJcbiAgICBwcml2YXRlIHRvcEJvdW5kYXJ5OiBudW1iZXIgPSAwXHJcbiAgICBwcml2YXRlIGJvdHRvbUJvdW5kYXJ5OiBudW1iZXIgPSAwXHJcblxyXG4gICAgLy8vIOinhuWPo1xyXG4gICAgZ2V0IHZpZXdQb3J0KCk6Y2MuTm9kZSB7IHJldHVybiB0aGlzLmNvbnRlbnQucGFyZW50fVxyXG5cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIC8vLyDlj6rlhYHorrjkuIDkuKrmlrnlkJFcclxuICAgICAgICB0aGlzLmhvcml6b250YWwgPSB0aGlzLnZlcnRpY2FsPyBmYWxzZTogdHJ1ZTtcclxuICAgICAgICBpZiggdGhpcy5jb250ZW50KSB7XHJcbiAgICAgICAgICAgIC8vLyBpbml0aWFsaXplIGNvbnRlbnQgdmlld1xyXG4gICAgICAgICAgICBsZXQgYW5jaCA9IHRoaXMuaG9yaXpvbnRhbD8gY2MudjIoIDAsIDAuNSk6IGNjLnYyKCAwLjUsIDEpXHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRBbmNob3JQb2ludCggYW5jaCkgXHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRQb3NpdGlvbiggY2MuVmVjMi5aRVJPKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gaW5pdGlhbGl6ZSBkYXRhXHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkoKVxyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgc3VwZXIub25FbmFibGUoKVxyXG4gICAgICAgIHRoaXMubm9kZS5vbiggXCJzY3JvbGxpbmdcIiwgdGhpcy5vblNjcm9sbGluZywgdGhpcylcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKXtcclxuICAgICAgICBzdXBlci5vbkRpc2FibGUoKVxyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoIFwic2Nyb2xsaW5nXCIsIHRoaXMub25TY3JvbGxpbmcsIHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgLy8vIGluaXRpYWxpemUgdG90YWwgY291bnQsIGl0ZW0gY3JlYXRvclxyXG4gICAgaW5pdGlhbGl6ZShjcmVhdG9yOiggdmlldzogTG9vcExpc3QsIGlkeDogbnVtYmVyKT0+TG9vcExpc3RJdGVtLCBjb3VudDogbnVtYmVyID0gMCl7XHJcbiAgICAgICAgdGhpcy5fdG90YWxjb3VudCA9IGNvdW50IHx8IDBcclxuICAgICAgICB0aGlzLl9pdGVtQ3JlYXRvciA9IGNyZWF0b3JcclxuICAgICAgICB0aGlzLl9pbml0aWFsaXplUG9vbCgpXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoKSBcclxuICAgIH1cclxuXHJcbiAgICAvLy8g6K6+572u5b2T5YmNaXRlbSBjb3VudCDlpoLmnpzkuI3mmK/lvLrliLZSZXNldFxyXG4gICAgLy8vIOmCo+S5iOWkp+S6juetieS6juW9k+WJjWl0ZW1jb3V0IHx8IOacgOWQjuS4gOmhuWl0ZW3kuI3mmK8g5b2T5YmNaXRlbSDoh6rliqjkvb/nlKjliLfmlrDmlrnlvI/kuI3kvJrkv67mlLnlvZPliY1pdGVtIOeahOaYvuekuuS9jee9rlxyXG4gICAgc2V0SXRlbUNvdW50KCBjb3VudDogbnVtYmVyLCBiUmVzZXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmKCBiUmVzZXQpIHsgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudFBvc2l0aW9uKCBjYy5WZWMyLlpFUk8pIFxyXG4gICAgICAgICAgICB0aGlzLl90b3RhbGNvdW50ID0gY291bnRcclxuICAgICAgICAgICAgdGhpcy5zaG93SXRlbSggMClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgb2xkY291bnQgPSB0aGlzLl90b3RhbGNvdW50XHJcbiAgICAgICAgICAgIHRoaXMuX3RvdGFsY291bnQgPSBjb3VudFxyXG4gICAgICAgICAgICAvLy8g5aaC5p6c5paw55qEaXRlbSBjb3VudCDlpKfkuo4gb2xkSXRlbWNvdW506YKj5LmI5aSn5LqO562J5LqO5b2T5YmNaXRlbWNvdXRcclxuICAgICAgICAgICAgbGV0IGxhc3RJdGVtID0gdGhpcy5faXRlbXMubGVuZ3RoID4gMD8gdGhpcy5faXRlbXNbIHRoaXMuX2l0ZW1zLmxlbmd0aC0xXTogbnVsbFxyXG4gICAgICAgICAgICBpZiggY291bnQgPj0gb2xkY291bnQgfHwgKGxhc3RJdGVtICE9IG51bGwgJiYgbGFzdEl0ZW0uaXRlbUlkeCA8IChjb3VudCAtMSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hJdGVtcygpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dJdGVtKCBjb3VudCAtIDEpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgXHJcbiAgICAvLy8g5Yi35paw5b2T5YmN5omA5pyJaXRlbVxyXG4gICAgcmVmcmVzaEl0ZW1zKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLl90b3RhbGNvdW50ID4gMCAmJiB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBmcmlzdEl0ZW0gICA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgICAgIGxldCBwb3MgICAgICAgICA9IGZyaXN0SXRlbS5ub2RlLnBvc2l0aW9uXHJcbiAgICAgICAgICAgIGxldCBpdGVtSWR4ICAgICA9IGZyaXN0SXRlbS5pdGVtSWR4XHJcbiAgICAgICAgICAgIC8vLyBjcmVhdGUgdG9wIGl0ZW1cclxuICAgICAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKClcclxuICAgICAgICAgICAgbGV0IGFyZyA9IHRoaXMuaG9yaXpvbnRhbD8gcG9zLng6IHBvcy55XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCBpdGVtSWR4LCBhcmcpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0VmlldygpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDnm7TmjqXlsZXnpLppdGVtIOWIsGlkeFxyXG4gICAgcHJpdmF0ZSBhbmltZUlkeDogbnVtYmVyID0gMFxyXG4gICAgcHJpdmF0ZSBiQW5pbWVNb3ZlaW5nOiBib29sZWFuID0gZmFsc2VcclxuICAgIHNob3dJdGVtKCBpZHg6IG51bWJlciwgYkFuaW1lOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAvLyDpmZDlrprliLAgMCAtIO+8iHRvdGFsY291bnQgLTHvvInojIPlm7TlhoVcclxuICAgICAgICBpZHggPSBNYXRoLm1pbiggdGhpcy5fdG90YWxjb3VudCAtIDEsIE1hdGgubWF4KDAsIGlkeCkpIFxyXG4gICAgICAgIGlmKCBiQW5pbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5hbmltZUlkeCA9IGlkeDtcclxuICAgICAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLy8g5Zue5pS25omA5pyJaXRlbXMg5LuO5paw5Yib5bu6dG9wIGl0ZW1cclxuICAgICAgICAgICAgaWYoIHRoaXMuaG9yaXpvbnRhbCkgeyB0aGlzLl9zaG93SXRlbUhvciggaWR4KSB9XHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl9zaG93SXRlbVZlciggaWR4KSB9XHJcbiAgICAgICAgICAgIC8vLyDmo4Dmn6XmmK/lkKbpnIDopoHlm57mu5rkvY3nva5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOiOt+WPluS4gOS4qml0ZW0gXHJcbiAgICBnZXRJdGVtKCBrZXk6IHN0cmluZyA9IG51bGwpOiBMb29wTGlzdEl0ZW0ge1xyXG4gICAgICAgIGtleSA9IGtleSB8fCB0aGlzLl90ZW1wbGF0ZVxyXG4gICAgICAgIGxldCBwb29sID0gdGhpcy5faXRlbVBvb2xba2V5XVxyXG4gICAgICAgIGxldCBpbnN0YW5jZTogTG9vcExpc3RJdGVtID0gKHBvb2wgJiYgcG9vbC5sZW5ndGggPiAwKT8gcG9vbC5wb3AoKTogbnVsbFxyXG4gICAgICAgIGlmICggaW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgcHJlZmFiID0gdGhpcy5fdGVtcGxhdGVzW2tleV1cclxuICAgICAgICAgICAgaWYoIHByZWZhYiAhPSBudWxsKSB7IFxyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBjYy5pbnN0YW50aWF0ZSggcHJlZmFiLm5vZGUpIFxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBub2RlLmdldENvbXBvbmVudCggTG9vcExpc3RJdGVtKVxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuaXRlbUtleSA9IGtleVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2l0ZW1TaXplRGlydHk6IGJvb2xlYW4gPSB0cnVlXHJcbiAgICBpdGVtU2l6ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pdGVtRGlydHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgb25TY3JvbGxpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSggZHQ6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZSggZHQpXHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1TaXplRGlydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSA9IGZhbHNlXHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmhvcml6b250YWwpIHsgdGhpcy5fdXBkYXRlSG9yaXpvbnRhbEl0ZW1zKCl9XHJcbiAgICAgICAgICAgIGVsc2UgeyB0aGlzLl91cGRhdGVWZXJ0aWNhbEl0ZW1zKCl9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtRGlydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gZmFsc2VcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8g5Yqo55S756e75YqoXHJcbiAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gdGhpcy5fc2Nyb1xyXG4gICAgICAgIGlmKCB0aGlzLmJBbmltZU1vdmVpbmcpIHtcclxuICAgICAgICAgICAgaWYoIHRoaXMuaG9yaXpvbnRhbCkgeyBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FuaW1lU2hvd0l0ZW1Ib3IoIHRoaXMuYW5pbWVJZHgpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmltZVNob3dJdGVtVmVyKCB0aGlzLmFuaW1lSWR4KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luaXRpYWxpemVQb29sKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtUG9vbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1Qb29sID0ge31cclxuICAgICAgICAgICAgbGV0IHByZWZhYnMgPSB0aGlzLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKCBMb29wTGlzdEl0ZW0pXHJcbiAgICAgICAgICAgIHByZWZhYnMuZm9yRWFjaCggaXRlbT0+e1xyXG4gICAgICAgICAgICAgICAgLy8vIHNhdmUgdGVtcGxhdGVzIFxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IGl0ZW0uaXRlbUtleSA9IGl0ZW0ubm9kZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSAgICAgICAgICA9IHRoaXMuX3RlbXBsYXRlID09IG51bGw/IGtleTogdGhpcy5fdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlc1trZXldICAgID0gaXRlbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4UGFkZGluZyAgICAgICAgPSBNYXRoLm1heCggdGhpcy5fbWF4UGFkZGluZywgaXRlbS5wYWRkaW5nKzIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCBpdGVtKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaG93SXRlbVZlciggaWR4OiBudW1iZXIpIHtcclxuICAgICAgICAvLy8g5Yik5pat56ys5LiA5Liq5ZKM5pyA5ZCO5LiA5Liq6YO95Zyo56qX5Y+j5YaF5bCx5LiN55So5omn6KGM5LqGXHJcbiAgICAgICAgbGV0IGZyaXN0ID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgbGFzdCA9IHRoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICBpZiggZnJpc3QuaXRlbUlkeCA9PT0gMCAmJiBsYXN0Lml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50LTEpICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtVG9wKCBmcmlzdCkgPD0gdGhpcy5fdG9wQm91bmRhcnkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtQm90dG9tKCBsYXN0KSA+PSB0aGlzLl9ib3R0b21Cb3VuZGFyeSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOWbnuaUtuW9k+WJjeaJgOaciWl0ZW0gJiByZXNldCBjb250ZW50IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldyggaWR4KSl7XHJcbiAgICAgICAgICAgIC8vLyDliKTmlq3mnIDlkI7kuIDmnaHmmK/lkKblnKjnqpflj6PlhoXpg6jpnIDopoHpnaDnqpflj6PlupXpg6hcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1sgdGhpcy5faXRlbXMubGVuZ3RoIC0xXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b20gPSB0aGlzLl9nZXRJdGVtQm90dG9tKCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYoIGJvdHRvbSA+IHRoaXMuX2JvdHRvbUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIC8vLyDnp7vliqjnqpflj6PlkI7pnIDopoHph43mlrDliqDovb3pobbpg6hpdGVtICZcclxuICAgICAgICAgICAgICAgICAgICAvLy8g5Yik5patIHRvcGl0ZW0g5piv5ZCm5Zyo6aG26YOo6L6555WM6YeM6Z2i5Y675LqGXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdGl0ZW0uaXRlbUlkeCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvcCA9IHRoaXMuX2dldEl0ZW1Ub3AoIHRpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRvcCA8IHRoaXMuX3RvcEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnkgPSB0aGlzLmNvbnRlbnQueSArICh0aGlzLl90b3BCb3VuZGFyeSAtIHRvcClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLy8g5qCH6K6waXRlbSDpnIDopoHph43mlrDliJvlu7rlm57mlLZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd0l0ZW1Ib3IoIGlkeDogbnVtYmVyKXtcclxuICAgICAgICAvLy8g5Yik5pat56ys5LiA5Liq5ZKM5pyA5ZCO5LiA5Liq6YO95Zyo56qX5Y+j5YaF5bCx5LiN55So5omn6KGM5LqGXHJcbiAgICAgICAgbGV0IGZyaXN0ID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgbGFzdCA9IHRoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICBpZiggZnJpc3QuaXRlbUlkeCA9PT0gMCAmJiBsYXN0Lml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50LTEpICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtTGVmdCggZnJpc3QpID49IHRoaXMuX2xlZnRCb3VuZGFyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEl0ZW1SaWdodCggbGFzdCkgPD0gdGhpcy5fcmlnaHRCb3VuZGFyeSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOWbnuaUtuW9k+WJjeaJgOaciWl0ZW0gJiByZXNldCBjb250ZW50IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldyggaWR4KSkge1xyXG4gICAgICAgICAgICAvLy8g5Yik5pat5pyA5ZCO5LiA5p2h5piv5ZCm5Zyo56qX5Y+j5YaF6YOo6ZyA6KaB6Z2g56qX5Y+j5Y+z6L65XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbIHRoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLl9nZXRJdGVtUmlnaHQoIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpZiggcmlnaHQgPCB0aGlzLl9yaWdodEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnggPSB0aGlzLl9yaWdodEJvdW5kYXJ5IC0gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICAvLy8g5Yik5patIGxlZnRpdGVtIOaYr+WQpuWcqOW3pui+ueeVjOi+ueeVjOmHjOmdouWOu+S6hlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldygpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRpdGVtLml0ZW1JZHggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gdGhpcy5fZ2V0SXRlbUxlZnQoIHRpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJjcmVhdGUgbGVmdCBpdGVtcyFcIiwgbGVmdCwgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGxlZnQgPiB0aGlzLl9sZWZ0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQueCA9IHRoaXMuY29udGVudC54IC0gKGxlZnQgLSB0aGlzLl9sZWZ0Qm91bmRhcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vIOagh+iusGl0ZW0g6ZyA6KaB6YeN5paw5Yib5bu65Zue5pS2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FuaW1lU2hvd0l0ZW1WZXIoIGlkeDogbnVtYmVyKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYW5pbWVTaG93SXRlbUhvciggaWR4OiBudW1iZXIpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVjeWNsZShpdGVtOiBMb29wTGlzdEl0ZW0pIHtcclxuICAgICAgICBsZXQgcG9vbCA9IHRoaXMuX2l0ZW1Qb29sW2l0ZW0uaXRlbUtleV1cclxuICAgICAgICBpZiggcG9vbCA9PSBudWxsKSB7IHBvb2wgPSB0aGlzLl9pdGVtUG9vbFtpdGVtLml0ZW1LZXldID0gW10gfVxyXG4gICAgICAgIGl0ZW0ubm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgIGl0ZW0ubG9vcGxpc3QgPSBudWxsXHJcbiAgICAgICAgcG9vbC5wdXNoKCBpdGVtKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9yZWN5Y2xlQWxsSXRlbXMoIHJlc2V0OmJvb2xlYW4gPSBmYWxzZSl7XHJcbiAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCggaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIGl0ZW0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5faXRlbXMgPSBbXVxyXG4gICAgICAgIGlmKCByZXNldCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BBdXRvU2Nyb2xsKClcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnBvc2l0aW9uID0gY2MuVmVjMi5aRVJPXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZU5ld0l0ZW0oIGlkeDogbnVtYmVyKTogTG9vcExpc3RJdGVtIHtcclxuICAgICAgICBpZiggaWR4IDwgMCB8fCBpZHggPj0gdGhpcy5fdG90YWxjb3VudCkgcmV0dXJuIG51bGwgXHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtQ3JlYXRvcj8gdGhpcy5faXRlbUNyZWF0b3IoIHRoaXMsIGlkeCkgOiBudWxsXHJcbiAgICAgICAgaWYoIGl0ZW0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpdGVtLm5vZGUucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87IGl0ZW0uaXRlbUlkeCA9IGlkeDsgXHJcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpdGVtLmxvb3BsaXN0ID0gdGhpczsgXHJcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5wYXJlbnQgPSB0aGlzLmNvbnRlbnRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRJdGVtQXQoIGlkeDogbnVtYmVyKTogTG9vcExpc3RJdGVte1xyXG4gICAgICAgIGZvciggbGV0IGk9MDsgaTx0aGlzLl9pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW2ldIFxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09IGlkeCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEl0ZW1Ub3AoIGl0ZW06IExvb3BMaXN0SXRlbSk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubm9kZS55ICsgdGhpcy5jb250ZW50LnlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRJdGVtQm90dG9tKCBpdGVtOiBMb29wTGlzdEl0ZW0pOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpdGVtdG9wID0gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSlcclxuICAgICAgICByZXR1cm4gaXRlbXRvcCAtIGl0ZW0ubm9kZS5oZWlnaHQgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbUxlZnQoIGl0ZW06IExvb3BMaXN0SXRlbSk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubm9kZS54ICsgdGhpcy5jb250ZW50LnggLy8gKyBpdGVtLm9mZnNldFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEl0ZW1SaWdodCggaXRlbTogTG9vcExpc3RJdGVtKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgaXRlbUxlZnQgPSB0aGlzLl9nZXRJdGVtTGVmdCggaXRlbSlcclxuICAgICAgICByZXR1cm4gaXRlbUxlZnQgKyBpdGVtLm5vZGUud2lkdGhcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVMaXN0VmlldyggaWR4OiBudW1iZXIgPSAwLCBwb3M6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAvLy8gcmVjeWNsZSBhbGwgaXRlbXNcclxuICAgICAgICBpZiggdGhpcy5fdG90YWxjb3VudCA9PSAwICYmIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGN1ciBjb3VudFxyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmhvcml6b250YWw/IHRoaXMuX2NyZWF0ZUxlZnRJdGVtKCBpZHgsIHBvcyk6IHRoaXMuX2NyZWF0ZVRvcEl0ZW0oIGlkeCwgcG9zKVxyXG4gICAgICAgICAgICBpZiggaXRlbSA9PSBudWxsKSB7IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBvdGhlciBpdGVtc1xyXG4gICAgICAgIGxldCBjaGVja2NvdW50ID0gMFxyXG4gICAgICAgIGxldCBjYWxsID0gdGhpcy5ob3Jpem9udGFsPyB0aGlzLl91cGRhdGVIb3Jpem9udGFsOiB0aGlzLl91cGRhdGVWZXJ0aWNhbFxyXG4gICAgICAgIHdoaWxlKCBjYWxsLmNhbGwoIHRoaXMpKSB7XHJcbiAgICAgICAgICAgIGlmKCArK2NoZWNrY291bnQgPj0gdGhpcy5mcmFtZUNyZWF0ZU1heCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlVG9wSXRlbSggaWR4OiBudW1iZXIsIHk6IG51bWJlciA9IG51bGwpOiBMb29wTGlzdEl0ZW0ge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggaWR4KVxyXG4gICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmKCB5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gLXRoaXMuX2dldEl0ZW1Ub3AoIGl0ZW0pICsgdGhpcy5fdG9wQm91bmRhcnkgLSBpdGVtLm9mZnNldFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSB5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgIH1cclxuXHJcbiAgICAvLy8g5LuO5paw5o6S5bqPaXRlbXNcclxuICAgIHByaXZhdGUgX3VwZGF0ZVZlcnRpY2FsSXRlbXMoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgbGV0IHBpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgZm9yKCBsZXQgaWR4PTE7IGlkeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgaWR4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1tpZHhdXHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHBpdGVtLm5vZGUueSAtIHBpdGVtLm5vZGUuaGVpZ2h0IC0gaXRlbS5wYWRkaW5nXHJcbiAgICAgICAgICAgICAgICBwaXRlbSA9IGl0ZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVWZXJ0aWNhbCgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gaWYoIHRoaXMuX2NoZWNrUmVjeWNsZSgpICkgeyByZXR1cm4gZmFsc2V9XHJcbiAgICAgICAgLy8gLy8vIGZpbGwgdXAgJiBmaWxsIGRvd25cclxuICAgICAgICBsZXQgY3VyQ291bnQgPSB0aGlzLl9pdGVtcy5sZW5ndGhcclxuICAgICAgICAvLyBpZiggY3VyQ291bnQgPT09IDApIHtcclxuICAgICAgICAvLyAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVUb3BJdGVtKDApXHJcbiAgICAgICAgLy8gICAgIHJldHVybiBpdGVtICE9IG51bGxcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8vIHJlY3ljbGUgdG9wIGl0ZW0g5Zue5pS26aG26YOo5pWw5o2uIOWmguaenOacgOW6leS4i+eahGl0ZW0g5piv5pyA5ZCO5LiA5p2h6YKj5LmI5LiN5Zue5pS25LiK6Z2i55qEaXRlbVxyXG4gICAgICAgIGxldCB0b3BpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgYm90dG9taXRlbSA9IHRoaXMuX2l0ZW1zWyBjdXJDb3VudC0xXVxyXG4gICAgICAgIGxldCBib3R0b21fYm90dG9tID0gdGhpcy5fZ2V0SXRlbUJvdHRvbSggYm90dG9taXRlbSlcclxuICAgICAgICBpZiggY3VyQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHRvcCBpdGVtXHJcbiAgICAgICAgICAgIGxldCBjYW5SZWN5Y2xlVG9wID0gKGJvdHRvbWl0ZW0uaXRlbUlkeCAhPT0gdGhpcy5fdG90YWxjb3VudC0xIHx8IGJvdHRvbV9ib3R0b20gPCB0aGlzLl9ib3R0b21Cb3VuZGFyeSlcclxuICAgICAgICAgICAgaWYoIGNhblJlY3ljbGVUb3AgJiYgdGhpcy5fZ2V0SXRlbUJvdHRvbSggdG9waXRlbSkgPiAodGhpcy50b3Bib3VuZGFyeSArIHRoaXMuX21heFBhZGRpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVJdGVtUGFkZGluZyA9IHRvcGl0ZW0ucGFkZGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggdG9waXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIGJvdHRvbSBpdGVtXHJcbiAgICAgICAgICAgIGlmKCB0b3BpdGVtLml0ZW1JZHggPiAwICYmIHRoaXMuX2dldEl0ZW1Ub3AoIGJvdHRvbWl0ZW0pIDwgKHRoaXMuYm90dG9tYm91bmRhcnkgLSB0aGlzLl9tYXhQYWRkaW5nKSkgeyBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggY3VyQ291bnQtMSwgMSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIGJvdHRvbWl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBjcmVhdGUgdG9wIGl0ZW1cclxuICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbVRvcCggdG9waXRlbSkgPCB0aGlzLnRvcGJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggdG9waXRlbS5pdGVtSWR4IC0gMSlcclxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gdG9waXRlbS5ub2RlLnkgKyBpdGVtLnBhZGRpbmcgKyBpdGVtLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBjcmVhdGUgYm90dG9tIGl0ZW1cclxuICAgICAgICBpZiggYm90dG9tX2JvdHRvbSA+IHRoaXMuYm90dG9tYm91bmRhcnkpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCBib3R0b21pdGVtLml0ZW1JZHggKyAxKVxyXG4gICAgICAgICAgICBpZiggaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSBib3R0b21pdGVtLm5vZGUueSAtIGJvdHRvbWl0ZW0ubm9kZS5oZWlnaHQgLSBib3R0b21pdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZUxlZnRJdGVtKCBpZHg6IG51bWJlciwgeDpudW1iZXIgPSBudWxsKSA6IExvb3BMaXN0SXRlbXtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIGlkeClcclxuICAgICAgICBpZiggaXRlbSkge1xyXG4gICAgICAgICAgICBpZiggeCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IC10aGlzLl9nZXRJdGVtTGVmdCggaXRlbSkgKyB0aGlzLl9sZWZ0Qm91bmRhcnkgKyBpdGVtLm9mZnNldFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSB4XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVIb3Jpem9udGFsSXRlbXMoKXtcclxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBsZXQgcHJlaXRlbSA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgICAgIGZvciggbGV0IGlkeD0xOyBpZHggPCB0aGlzLl9pdGVtcy5sZW5ndGg7IGlkeCsrKXtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbaWR4XVxyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSBwcmVpdGVtLm5vZGUueCArIHByZWl0ZW0ubm9kZS5oZWlnaHQgKyBpdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHByZWl0ZW0gPSBpdGVtXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlSG9yaXpvbnRhbCgpOiBib29sZWFue1xyXG4gICAgICAgIC8vIGlmKCB0aGlzLl9jaGVja1JlY3ljbGUoKSkgeyByZXR1cm4gZmFsc2V9XHJcbiAgICAgICAgbGV0IGN1ckNvdW50ID0gdGhpcy5faXRlbXMubGVuZ3RoXHJcbiAgICAgICAgLy8gaWYoIGN1ckNvdW50ID09IDApIHtcclxuICAgICAgICAvLyAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVMZWZ0SXRlbSgwKVxyXG4gICAgICAgIC8vICAgICByZXR1cm4gaXRlbSAhPSBudWxsPyB0cnVlOiBmYWxzZVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLy8gZmlsbCBsZWZ0ICYgZmlsbCByaWdodFxyXG4gICAgICAgIGxldCBsZWZ0SXRlbSA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgbGV0IHJpZ2h0SXRlbSA9IHRoaXMuX2l0ZW1zWyBjdXJDb3VudC0xXVxyXG4gICAgICAgIGxldCByaWdodF9yaWdodCA9IHRoaXMuX2dldEl0ZW1SaWdodCggcmlnaHRJdGVtKVxyXG4gICAgICAgIGlmKCBjdXJDb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgLy8vIHJlY3ljbGUgbGVmdCBpdGVtXHJcbiAgICAgICAgICAgIGxldCBjYW5SZWN5Y2xlTGVmdCA9IChyaWdodEl0ZW0uaXRlbUlkeCAhPT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSB8fCByaWdodF9yaWdodCA+IHRoaXMucmlnaHRib3VuZGFyeSlcclxuICAgICAgICAgICAgaWYoIGNhblJlY3ljbGVMZWZ0ICYmIHRoaXMuX2dldEl0ZW1SaWdodCggbGVmdEl0ZW0pIDwgKHRoaXMubGVmdGJvdW5kYXJ5IC0gdGhpcy5fbWF4UGFkZGluZykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ByZUl0ZW1QYWRkaW5nID0gbGVmdEl0ZW0ucGFkZGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggbGVmdEl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHJpZ2h0IGl0ZW1cclxuICAgICAgICAgICAgaWYoIGxlZnRJdGVtLml0ZW1JZHggPiAwICYmIHRoaXMuX2dldEl0ZW1MZWZ0KHJpZ2h0SXRlbSkgPiAodGhpcy5yaWdodGJvdW5kYXJ5ICsgdGhpcy5fbWF4UGFkZGluZykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggY3VyQ291bnQtMSwgMSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIHJpZ2h0SXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBsZWZ0IGl0ZW1cclxuICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbUxlZnQoIGxlZnRJdGVtKSA+IHRoaXMubGVmdGJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggbGVmdEl0ZW0uaXRlbUlkeCAtIDEpXHJcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IGxlZnRJdGVtLm5vZGUueCAtIGl0ZW0ubm9kZS53aWR0aCAtIGl0ZW0ucGFkZGluZyBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbVxyXG4gICAgICAgIGlmKCByaWdodF9yaWdodCA8IHRoaXMucmlnaHRib3VuZGFyeSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIHJpZ2h0SXRlbS5pdGVtSWR4ICsgMSlcclxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gcmlnaHRJdGVtLm5vZGUueCArIHJpZ2h0SXRlbS5ub2RlLndpZHRoICsgcmlnaHRJdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8g5LiL6Z2i55qE5Ye95pWw6YO95piv6YeN5YaZc2Nyb2xsdmlldyDljp/mnInnmoTlh73mlbBcclxuXHJcbiAgICAvLy8vIHN0b3AgYW5pbWUgbW92ZWluZyBvbiB0b3VjaCBiZWdhblxyXG4gICAgX29uVG91Y2hCZWdhbiggZXZlbnQ6IGNjLkV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzOiBhbnkpe1xyXG4gICAgICAgIHN1cGVyLl9vblRvdWNoQmVnYW4oIGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKVxyXG4gICAgICAgIGlmKCBldmVudC5pc1N0b3BwZWQpeyB0aGlzLmJBbmltZU1vdmVpbmcgPSBmYWxzZSB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOiuoeeul+i+ueeVjFxyXG4gICAgX2NhbGN1bGF0ZUJvdW5kYXJ5KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuY29udGVudCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuc2V0Q29udGVudFNpemUoIGNjLnNpemUoIHRoaXMudmlld1BvcnQud2lkdGgsIHRoaXMudmlld1BvcnQuaGVpZ2h0KSlcclxuICAgICAgICAgICAgLy8vIHZpZXcgcG9ydFxyXG4gICAgICAgICAgICBsZXQgdmlld1NpemUgPSB0aGlzLnZpZXdQb3J0LmdldENvbnRlbnRTaXplKCk7XHJcbiAgICAgICAgICAgIGxldCBhbmNob3JYID0gdmlld1NpemUud2lkdGggKiB0aGlzLnZpZXdQb3J0LmFuY2hvclg7XHJcbiAgICAgICAgICAgIGxldCBhbmNob3JZID0gdmlld1NpemUuaGVpZ2h0ICogdGhpcy52aWV3UG9ydC5hbmNob3JZO1xyXG4gICAgICAgICAgICAvLy8g6K6h566X5LiK5LiL5bem5Y+z6L6555WMXHJcbiAgICAgICAgICAgIHRoaXMuX2xlZnRCb3VuZGFyeSAgPSAtYW5jaG9yWDtcclxuICAgICAgICAgICAgdGhpcy5fYm90dG9tQm91bmRhcnkgPSAtYW5jaG9yWTtcclxuICAgICAgICAgICAgdGhpcy5fcmlnaHRCb3VuZGFyeSA9IHRoaXMuX2xlZnRCb3VuZGFyeSArIHZpZXdTaXplLndpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl90b3BCb3VuZGFyeSAgID0gdGhpcy5fYm90dG9tQm91bmRhcnkgKyB2aWV3U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIC8vLyDorqHnrpflm57mlLbovrnnlYxcclxuICAgICAgICAgICAgdGhpcy5sZWZ0Ym91bmRhcnkgICA9IHRoaXMuX2xlZnRCb3VuZGFyeSAtIHRoaXMuY2FjaGVCb3VuZGFyeVxyXG4gICAgICAgICAgICB0aGlzLnJpZ2h0Ym91bmRhcnkgID0gdGhpcy5fcmlnaHRCb3VuZGFyeSArIHRoaXMuY2FjaGVCb3VuZGFyeVxyXG4gICAgICAgICAgICB0aGlzLnRvcGJvdW5kYXJ5ICAgID0gdGhpcy5fdG9wQm91bmRhcnkgKyB0aGlzLmNhY2hlQm91bmRhcnlcclxuICAgICAgICAgICAgdGhpcy5ib3R0b21ib3VuZGFyeSA9IHRoaXMuX2JvdHRvbUJvdW5kYXJ5IC0gdGhpcy5jYWNoZUJvdW5kYXJ5XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDoo4Hliarnp7vliqjph49cclxuICAgIF9jbGFtcERlbHRhIChkZWx0YTogY2MuVmVjMikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5sZW5ndGggPiAwPyBkZWx0YTogY2MuVmVjMi5aRVJPO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDlt6bovrnnlYzlm57lvLkgXHJcbiAgICAvLy8gcGFnZVZpZXcg5Lmf5Y+v5Lul5Zyo6L+Z6YeM5a6e546wICYg6YCa6L+H5Yik5pat5b2T5YmN5q2j5Zyodmlld3BvcnQg55qE56ys5LiA5LiqaXRlbSDnhLblkI7ov5Tlm57or6VpdGVtIOeahOS4jkxlZnRCb3VuZGRhcnnnmoTlhbPns7tcclxuICAgIF9nZXRDb250ZW50TGVmdEJvdW5kYXJ5ICgpe1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW1MZWZ0KCBpdGVtKSAtIGl0ZW0ub2Zmc2V0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnRCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDlj7PovrnnlYzlm57lvLlcclxuICAgIF9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSAoKXtcclxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aC0xXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtMSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRJdGVtUmlnaHQoIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JpZ2h0Qm91bmRhcnlcclxuICAgIH1cclxuXHJcbiAgICAvLy8g6YeN5YaZ6K+l5Ye95pWw5a6e546w5LiK6L6555WM5Zue5by5XHJcbiAgICAvLy8gcGFnZVZpZXcg5Lmf5Y+v5Lul5Zyo6L+Z6YeM5a6e546wICYg6YCa6L+H5Yik5pat5b2T5YmN5q2j5Zyodmlld3BvcnQg55qE56ys5LiA5LiqaXRlbSDnhLblkI7ov5Tlm57or6VpdGVtIOeahOS4jkxlZnRCb3VuZGRhcnnnmoTlhbPns7tcclxuICAgIF9nZXRDb250ZW50VG9wQm91bmRhcnkgKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW1Ub3AoIGl0ZW0pICsgaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdG9wQm91bmRhcnlcclxuICAgIH1cclxuXHJcbiAgICAvLy8g6YeN5YaZ6K+l5Ye95pWw5a6e546w5LiL6L6555WM5Zue5by5XHJcbiAgICBfZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5ICgpIHtcclxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aC0xXVxyXG4gICAgICAgICAgICBpZiAoIGl0ZW0uaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW1Cb3R0b20oIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbUJvdW5kYXJ5XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YeN5YaZ6K+l5Ye95pWw5a6e546w6L6555WM5Zue5by5XHJcbiAgICBfZ2V0SG93TXVjaE91dE9mQm91bmRhcnkgKGFkZGl0aW9uOiBjYy5WZWMyKXtcclxuICAgICAgICBhZGRpdGlvbiA9IGFkZGl0aW9uIHx8IGNjLnYyKDAsIDApO1xyXG4gICAgICAgIC8vIOazqOmHiui/meihjOS8mumAoOaIkOWbnuW8uWJ1Z1xyXG4gICAgICAgIGlmIChhZGRpdGlvbi5mdXp6eUVxdWFscyhjYy52MigwLCAwKSwgRVBTSUxPTikgJiYgIXRoaXMuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IG91dE9mQm91bmRhcnlBbW91bnQgPSBjYy52MigwLCAwKTtcclxuICAgICAgICBpZiggdGhpcy5ob3Jpem9udGFsKXsgXHJcbiAgICAgICAgICAgIC8vLyDmsLTlubPmqKHlvI/lt6blj7PovrnnlYxcclxuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gMFxyXG4gICAgICAgICAgICBsZXQgbGVmdCA9IHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSArIGFkZGl0aW9uLnhcclxuICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5fZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkoKSArIGFkZGl0aW9uLnhcclxuICAgICAgICAgICAgaWYoIGxlZnQgPiB0aGlzLl9sZWZ0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueCA9IHRoaXMuX2xlZnRCb3VuZGFyeSAtIGxlZnRcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCByaWdodCA8IHRoaXMuX3JpZ2h0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueCA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgLSByaWdodDtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gbGVmdCArIG91dE9mQm91bmRhcnlBbW91bnQueFxyXG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDAgJiYgdGhpcy5faXRlbXNbMF0uaXRlbUlkeCA9PT0gMCAmJiB0ZW1wID49IHRoaXMuX2xlZnRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueCA9IHRoaXMuX2xlZnRCb3VuZGFyeSAtIGxlZnRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7IFxyXG4gICAgICAgICAgICAvLy8gIOWeguebtOaooeW8j+S4iuS4i+i+ueeVjFxyXG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSAwXHJcbiAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLl9nZXRDb250ZW50VG9wQm91bmRhcnkoKSArIGFkZGl0aW9uLnlcclxuICAgICAgICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuX2dldENvbnRlbnRCb3R0b21Cb3VuZGFyeSgpICsgYWRkaXRpb24ueVxyXG4gICAgICAgICAgICBpZiAoIHRvcCA8IHRoaXMuX3RvcEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl90b3BCb3VuZGFyeSAtIHRvcFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJvdHRvbSA+IHRoaXMuX2JvdHRvbUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIGJvdHRvbTtcclxuICAgICAgICAgICAgICAgIC8vLyDliKTmlq3nrKzkuIDmnaFpdGVtIOiQveS4i+adpeaYr+WQpuS8mui2hei/hyB0b3Bib3VuZGFyeSDlpoLmnpzotoXov4fopoHph43mlrDorqHnrpdcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gdG9wICsgb3V0T2ZCb3VuZGFyeUFtb3VudC55XHJcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLl9pdGVtc1swXS5pdGVtSWR4ID09PSAwICYmIHRlbXAgPD0gdGhpcy5fdG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl90b3BCb3VuZGFyeSAtIHRvcFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDvvJ/vvJ/vvJ9cclxuICAgICAgICBpZiAoYWRkaXRpb24uZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQgPSBvdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudCA9IHRoaXMuX2NsYW1wRGVsdGEob3V0T2ZCb3VuZGFyeUFtb3VudCk7XHJcbiAgICAgICAgcmV0dXJuIG91dE9mQm91bmRhcnlBbW91bnQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==