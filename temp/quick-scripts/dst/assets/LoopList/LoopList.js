
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
var Movement;
(function (Movement) {
    Movement[Movement["Horizontal"] = 0] = "Horizontal";
    Movement[Movement["Vertical"] = 1] = "Vertical";
})(Movement = exports.Movement || (exports.Movement = {}));
var LoopList = /** @class */ (function (_super) {
    __extends(LoopList, _super);
    function LoopList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.movement = Movement.Vertical;
        _this.cacheBoundary = 200;
        _this.frameCreateMax = 30;
        _this.scrollSpeedMax = 10;
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
        /// 缓存边界 recycle & create item boundary
        _this.leftBoundary = 0;
        _this.rightBoundary = 0;
        _this.topBoundary = 0;
        _this.bottomBoundary = 0;
        /// 上下左右边界
        _this._leftBoundary = 0;
        _this._bottomBoundary = 0;
        _this._rightBoundary = 0;
        _this._topBoundary = 0;
        /// 标记item size 是否变化
        _this._itemSizeDirty = true;
        /// 标记item 是否需要更新（创建或回收）
        _this._itemDirty = false;
        /// 滑动移动时用到的控制变量 展示item 到idx
        _this.animeIdx = 0;
        _this.bAnimeMoveing = false;
        /// 视口
        _this.scrollView = null;
        return _this;
    }
    Object.defineProperty(LoopList.prototype, "content", {
        get: function () { return this.scrollView.content; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoopList.prototype, "viewPort", {
        get: function () { return this.content.parent; },
        enumerable: true,
        configurable: true
    });
    LoopList.prototype.onLoad = function () {
        /// 只允许一个方向
        if (this.scrollView == null) {
            this.scrollView = this.getComponent(cc.ScrollView);
        }
        /// 重置scrollview 滚动属性
        this.scrollView.horizontal = this.movement == Movement.Horizontal;
        this.scrollView.vertical = this.movement == Movement.Vertical;
        /// 重定向scrollview 函数
        this.scrollView._getHowMuchOutOfBoundary = this._getHowMuchOutOfBoundary.bind(this);
        this.scrollView._calculateBoundary = this._calculateBoundary.bind(this);
        this.scrollView._clampDelta = this._clampDelta.bind(this);
        if (this.content) {
            /// initialize content view
            var anch = this.scrollView.horizontal ? cc.v2(0, 0.5) : cc.v2(0.5, 1);
            this.content.setAnchorPoint(anch);
            this.content.setPosition(cc.Vec2.ZERO);
        }
        /// initialize data
        this._calculateBoundary();
    };
    LoopList.prototype.onEnable = function () {
        this.scrollView.node.on("scrolling", this.onScrolling, this);
    };
    LoopList.prototype.onDisable = function () {
        this.scrollView.node.off("scrolling", this.onScrolling, this);
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
        var oldcount = this._totalcount;
        this._totalcount = count;
        if (bReset) {
            this._recycleAllItems(true);
            this._updateListView();
        }
        else {
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
            var arg = this.movement == Movement.Horizontal ? pos.x : pos.y;
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
            this.scrollView.stopAutoScroll();
            this.animeIdx = idx;
            this.bAnimeMoveing = true;
        }
        else {
            /// 回收所有items 从新创建top item
            switch (this.movement) {
                case Movement.Horizontal:
                    this._showItemHor(idx);
                    break;
                case Movement.Vertical:
                    this._showItemVer(idx);
                    break;
            }
        }
    };
    /// 获取一个item 
    LoopList.prototype.getNewItem = function (key) {
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
        this.bAnimeMoveing = false;
    };
    LoopList.prototype.update = function (dt) {
        /// 动画移动
        this.bAnimeMoveing = this._scrolling ? false : this.bAnimeMoveing;
        switch (this.movement) {
            case Movement.Horizontal:
                this._itemSizeDirty && this._updateHorizontalItems(); /// check item size dirty
                this.bAnimeMoveing && this._scrollToItemHor(this.animeIdx); /// check auto moveing
                break;
            case Movement.Vertical:
                this._itemSizeDirty && this._updateVerticalItems();
                this.bAnimeMoveing && this._scrollToItemVer(this.animeIdx);
                break;
        }
        this._itemSizeDirty = false;
        /// create || recycle item
        if (this._itemDirty) {
            this._itemDirty = false;
            this._updateListView();
        }
    };
    LoopList.prototype._initializePool = function () {
        var _this = this;
        if (this._itemPool == null) {
            this._itemPool = {};
            var prefabs = this.content.getComponentsInChildren(LoopListItem_1.default);
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
    LoopList.prototype.setContentPosition = function (pos) {
        this.scrollView.stopAutoScroll();
        if (this.scrollView.content) {
            this.scrollView.content.position = pos;
        }
    };
    LoopList.prototype._showItemVer = function (idx) {
        /// 判断需要现实的item和最后一个都在窗口内就不用执行了
        if (this._items.length > 0) {
            var frist = this._getItemAt(idx);
            var last = this._items[this._items.length - 1];
            if (frist != null && last.itemIdx === (this._totalcount - 1) &&
                this._getItemTop(frist) <= this._topBoundary &&
                this._getItemBottom(last) >= this._bottomBoundary) {
                return;
            }
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
                            }
                        }
                    }
                    /// 标记item 需要重新创建回收
                    this._itemDirty = true;
                }
            }
        }
    };
    LoopList.prototype._showItemHor = function (idx) {
        /// 判断需要显示的item和最后一个都在窗口内就不用执行了
        if (this._items.length > 0) {
            var frist = this._getItemAt(idx);
            var last = this._items[this._items.length - 1];
            if (frist != null && last.itemIdx === (this._totalcount - 1) &&
                this._getItemLeft(frist) >= this._leftBoundary &&
                this._getItemRight(last) <= this._rightBoundary) {
                return;
            }
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
                            if (left > this._leftBoundary) {
                                this.content.x = this.content.x - (left - this._leftBoundary);
                            }
                        }
                    }
                    /// 标记item 需要重新创建回收
                    this._itemDirty = true;
                }
            }
        }
    };
    LoopList.prototype._scrollToItemHor = function (idx) {
        var item = this._getItemAt(idx);
        var offset = 0;
        if (item == null) {
            offset = this._items[0].itemIdx > idx ? this.scrollSpeedMax : -this.scrollSpeedMax;
        }
        else {
            offset = this._leftBoundary - this._getItemLeft(item);
            if (idx === (this._totalcount - 1)) {
                offset = this._rightBoundary - this._getItemRight(item);
                offset = offset >= 0 ? 0 : offset;
            }
            else {
                var last = this._items[this._items.length - 1];
                if (last.itemIdx === (this._totalcount - 1) &&
                    this._getItemRight(last) <= this._rightBoundary) {
                    offset = 0;
                }
            }
        }
        /// 判断是否为0
        this.bAnimeMoveing = Math.abs(offset) > EPSILON;
        if (offset > this.scrollSpeedMax || offset < -this.scrollSpeedMax) {
            offset = Math.min(this.scrollSpeedMax, Math.max(-this.scrollSpeedMax, offset));
        }
        else {
            /// 做个线性插值更平滑
        }
        if (offset !== 0) {
            this._itemDirty = true;
            this.scrollView._moveContent(cc.v2(offset, 0), true);
        }
        else {
            this.scrollView.stopAutoScroll();
        }
    };
    LoopList.prototype._scrollToItemVer = function (idx) {
        var item = this._getItemAt(idx);
        var offset = 0;
        if (item == null) {
            offset = this._items[0].itemIdx > idx ? -this.scrollSpeedMax : this.scrollSpeedMax;
        }
        else {
            offset = this._topBoundary - this._getItemTop(item);
            if (idx === (this._totalcount - 1)) {
                offset = this._bottomBoundary - this._getItemBottom(item);
                offset = offset <= 0 ? 0 : offset;
            }
            else {
                var last = this._items[this._items.length - 1];
                if (last.itemIdx === (this._totalcount - 1) &&
                    this._getItemBottom(last) <= this._rightBoundary) {
                    offset = 0;
                }
            }
        }
        /// 判断是否为0
        this.bAnimeMoveing = Math.abs(offset) > EPSILON;
        if (offset > this.scrollSpeedMax || offset < -this.scrollSpeedMax) {
            offset = Math.min(this.scrollSpeedMax, Math.max(-this.scrollSpeedMax, offset));
        }
        else {
            /// 做个线性插值更平滑
        }
        if (offset !== 0) {
            this._itemDirty = true;
            this.scrollView._moveContent(cc.v2(0, offset), true);
        }
        else {
            this.scrollView.stopAutoScroll();
        }
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
        this.scrollView.stopAutoScroll();
        reset && this.setContentPosition(cc.Vec2.ZERO);
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
        /// cur count
        var checkcount = 0;
        var create = this.movement === Movement.Horizontal ? this._updateHorizontal : this._updateVertical;
        while (create.call(this, idx, pos)) {
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
    LoopList.prototype._updateVertical = function (idx, pos) {
        var curCount = this._items.length;
        /// recycle all items
        if (this._totalcount == 0 && curCount > 0) {
            this._recycleAllItems(true);
            return false;
        }
        /// fill up & fill down
        if (curCount === 0) {
            var item = this._createTopItem(idx, pos);
            return item != null;
        }
        /// recycle top item 回收顶部数据 如果最底下的item 是最后一条那么不回收上面的item
        var topitem = this._items[0];
        var bottomitem = this._items[curCount - 1];
        var bottom_bottom = this._getItemBottom(bottomitem);
        if (curCount > 1) {
            /// recycle top item
            var canRecycleTop = (bottomitem.itemIdx !== this._totalcount - 1 || bottom_bottom < this._bottomBoundary);
            if (canRecycleTop && this._getItemBottom(topitem) > (this.topBoundary + this._maxPadding)) {
                this._items.splice(0, 1);
                this._recycle(topitem);
                return true;
            }
            /// recycle bottom item
            if (topitem.itemIdx > 0 && this._getItemTop(bottomitem) < (this.bottomBoundary - this._maxPadding)) {
                this._items.splice(curCount - 1, 1);
                this._recycle(bottomitem);
                return true;
            }
        }
        /// create top item
        if (this._getItemTop(topitem) < this.topBoundary) {
            var item = this._createNewItem(topitem.itemIdx - 1);
            if (item) {
                item.node.y = topitem.node.y + item.padding + item.node.height;
                this._items.splice(0, 0, item);
                return true;
            }
        }
        /// create bottom item
        if (bottom_bottom > this.bottomBoundary) {
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
    LoopList.prototype._updateHorizontal = function (idx, pos) {
        var curCount = this._items.length;
        /// recycle all items
        if (this._totalcount == 0 && curCount > 0) {
            this._recycleAllItems(true);
            return false;
        }
        /// fill up & fill down
        if (curCount == 0) {
            var item = this._createLeftItem(idx, pos);
            return item != null ? true : false;
        }
        /// fill left & fill right
        var leftItem = this._items[0];
        var rightItem = this._items[curCount - 1];
        var right_right = this._getItemRight(rightItem);
        if (curCount > 1) {
            /// recycle left item
            var canRecycleLeft = (rightItem.itemIdx !== (this._totalcount - 1) || right_right > this.rightBoundary);
            if (canRecycleLeft && this._getItemRight(leftItem) < (this.leftBoundary - this._maxPadding)) {
                this._items.splice(0, 1);
                this._recycle(leftItem);
                return true;
            }
            /// recycle right item
            if (leftItem.itemIdx > 0 && this._getItemLeft(rightItem) > (this.rightBoundary + this._maxPadding)) {
                this._items.splice(curCount - 1, 1);
                this._recycle(rightItem);
                return true;
            }
        }
        /// create left item
        if (this._getItemLeft(leftItem) > this.leftBoundary) {
            var item = this._createNewItem(leftItem.itemIdx - 1);
            if (item) {
                item.node.x = leftItem.node.x - item.node.width - item.padding;
                this._items.splice(0, 0, item);
                return true;
            }
        }
        /// create bottom item
        if (right_right < this.rightBoundary) {
            var item = this._createNewItem(rightItem.itemIdx + 1);
            if (item) {
                item.node.x = rightItem.node.x + rightItem.node.width + rightItem.padding;
                this._items.push(item);
                return true;
            }
        }
    };
    /// 计算边界 下面的函数都是重写scrollview 原有的函数
    LoopList.prototype._calculateBoundary = function () {
        if (this.content) {
            this.content.setContentSize(cc.size(this.viewPort.width, this.viewPort.height));
            /// view port
            var viewSize = this.viewPort.getContentSize();
            var anchorX = viewSize.width * this.viewPort.anchorX;
            var anchorY = viewSize.height * this.viewPort.anchorY;
            /// 计算上下左右窗口边界
            this._leftBoundary = -anchorX;
            this._bottomBoundary = -anchorY;
            this._rightBoundary = this._leftBoundary + viewSize.width;
            this._topBoundary = this._bottomBoundary + viewSize.height;
            /// 计算上下左右 回收|创建 边界
            this.leftBoundary = this._leftBoundary - this.cacheBoundary;
            this.rightBoundary = this._rightBoundary + this.cacheBoundary;
            this.topBoundary = this._topBoundary + this.cacheBoundary;
            this.bottomBoundary = this._bottomBoundary - this.cacheBoundary;
            // console.log( "boundary:", this._topBoundary, this._bottomBoundary)
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
        switch (this.movement) {
            case Movement.Horizontal: {
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
                break;
            }
            case Movement.Vertical: {
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
                break;
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
    Object.defineProperty(LoopList.prototype, "_outOfBoundaryAmount", {
        /// 获取scrollview 的私有属性
        get: function () {
            return this.scrollView._outOfBoundaryAmount;
        },
        set: function (value) {
            this.scrollView._outOfBoundaryAmount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoopList.prototype, "_outOfBoundaryAmountDirty", {
        get: function () {
            return this.scrollView._outOfBoundaryAmountDirty;
        },
        set: function (value) {
            this.scrollView._outOfBoundaryAmountDirty = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoopList.prototype, "_scrolling", {
        get: function () {
            return this.scrollView._scrolling;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        property({ type: cc.Enum(Movement), serializable: true })
    ], LoopList.prototype, "movement", void 0);
    __decorate([
        property(cc.Float)
    ], LoopList.prototype, "cacheBoundary", void 0);
    __decorate([
        property(cc.Integer)
    ], LoopList.prototype, "frameCreateMax", void 0);
    __decorate([
        property(cc.Float)
    ], LoopList.prototype, "scrollSpeedMax", void 0);
    __decorate([
        property(cc.ScrollView)
    ], LoopList.prototype, "scrollView", void 0);
    LoopList = __decorate([
        ccclass,
        disallowMultiple(),
        menu("UIExtension/LoopList")
    ], LoopList);
    return LoopList;
}(cc.Component));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQTJDO0FBRTNDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQztBQUFBLENBQUMsQ0FBQTtBQUVoQixJQUFBLGtCQUEyRCxFQUExRCxvQkFBTyxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLHNDQUFpQyxDQUFDO0FBRWxFLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQixtREFBVSxDQUFBO0lBQ1YsK0NBQVEsQ0FBQTtBQUNaLENBQUMsRUFIVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUduQjtBQUtEO0lBQXNDLDRCQUFZO0lBSGxEO1FBQUEscUVBaXRCQztRQTNzQkcsY0FBUSxHQUFhLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFHL0IsbUJBQWEsR0FBVyxHQUFHLENBQUE7UUFHM0Isb0JBQWMsR0FBVyxFQUFFLENBQUE7UUFHM0Isb0JBQWMsR0FBVyxFQUFFLENBQUE7UUFFbkMsWUFBWTtRQUNKLGVBQVMsR0FBb0MsSUFBSSxDQUFBO1FBQ2pELGdCQUFVLEdBQWlDLEVBQUUsQ0FBQTtRQUM3QyxlQUFTLEdBQVcsSUFBSSxDQUFBLENBQUMsZUFBZTtRQUN4QyxrQkFBWSxHQUFpRCxJQUFJLENBQUE7UUFDakUsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDL0Isd0JBQXdCO1FBQ2hCLFlBQU0sR0FBbUIsRUFBRSxDQUFBO1FBQ25DLGdEQUFnRDtRQUN4QyxpQkFBVyxHQUFXLENBQUMsQ0FBQTtRQUUvQix1Q0FBdUM7UUFDL0Isa0JBQVksR0FBVyxDQUFDLENBQUE7UUFDeEIsbUJBQWEsR0FBVyxDQUFDLENBQUE7UUFDekIsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDdkIsb0JBQWMsR0FBVyxDQUFDLENBQUE7UUFDbEMsVUFBVTtRQUNGLG1CQUFhLEdBQWEsQ0FBQyxDQUFBO1FBQzNCLHFCQUFlLEdBQVcsQ0FB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QVUsQ0FBQyx5QkFBeUIsQ0FBQTtRQUNwRCxDQUFDO2FBRUQsVUFBK0IsS0FBYztZQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQTtRQUNyRCxDQUFDOzs7T0FKQTtJQU1ELHNCQUFJLGdDQUFVO2FBQWQ7WUFDSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFBO1FBQ3JDLENBQUM7OztPQUFBO0lBMXNCRDtRQURDLFFBQVEsQ0FBRSxFQUFDLElBQUksRUFBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQzs4Q0FDakI7SUFHdkM7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQzttREFDZTtJQUduQztRQURDLFFBQVEsQ0FBRSxFQUFFLENBQUMsT0FBTyxDQUFDO29EQUNhO0lBR25DO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0RBQ2U7SUFpQ25DO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0RBQ2U7SUE3Q3ZCLFFBQVE7UUFINUIsT0FBTztRQUNQLGdCQUFnQixFQUFFO1FBQ2xCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztPQUNSLFFBQVEsQ0E4c0I1QjtJQUFELGVBQUM7Q0E5c0JELEFBOHNCQyxDQTlzQnFDLEVBQUUsQ0FBQyxTQUFTLEdBOHNCakQ7a0JBOXNCb0IsUUFBUSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb29wTGlzdEl0ZW0gIGZyb20gXCIuL0xvb3BMaXN0SXRlbVwiO1xyXG5cclxuY29uc3QgRVBTSUxPTiA9IDFlLTQ7MVxyXG5cclxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5LCBtZW51LCBkaXNhbGxvd011bHRpcGxlfSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5leHBvcnQgZW51bSBNb3ZlbWVudHtcclxuICAgIEhvcml6b250YWwsXHJcbiAgICBWZXJ0aWNhbCxcclxufVxyXG5cclxuQGNjY2xhc3NcclxuQGRpc2FsbG93TXVsdGlwbGUoKVxyXG5AbWVudShcIlVJRXh0ZW5zaW9uL0xvb3BMaXN0XCIpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3BMaXN0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuXHJcbiAgICBAcHJvcGVydHkoIHt0eXBlOmNjLkVudW0oTW92ZW1lbnQpLCBzZXJpYWxpemFibGU6IHRydWV9KVxyXG4gICAgbW92ZW1lbnQ6IE1vdmVtZW50ID0gTW92ZW1lbnQuVmVydGljYWw7XHJcbiAgICBcclxuICAgIEBwcm9wZXJ0eSggY2MuRmxvYXQpXHJcbiAgICBwcml2YXRlIGNhY2hlQm91bmRhcnk6IG51bWJlciA9IDIwMFxyXG5cclxuICAgIEBwcm9wZXJ0eSggY2MuSW50ZWdlcilcclxuICAgIHByaXZhdGUgZnJhbWVDcmVhdGVNYXg6IG51bWJlciA9IDMwXHJcblxyXG4gICAgQHByb3BlcnR5KCBjYy5GbG9hdClcclxuICAgIHByaXZhdGUgc2Nyb2xsU3BlZWRNYXg6IG51bWJlciA9IDEwXHJcblxyXG4gICAgLy8vIGl0ZW0g57yT5a2Y5rGgXHJcbiAgICBwcml2YXRlIF9pdGVtUG9vbDogeyBba2V5OnN0cmluZ106IExvb3BMaXN0SXRlbVtdfSA9IG51bGxcclxuICAgIHByaXZhdGUgX3RlbXBsYXRlczoge1trZXk6c3RyaW5nXTogTG9vcExpc3RJdGVtfSA9IHt9XHJcbiAgICBwcml2YXRlIF90ZW1wbGF0ZTogc3RyaW5nID0gbnVsbCAvLy8g6buY6K6k5L2/55So55qEcHJlZmFiXHJcbiAgICBwcml2YXRlIF9pdGVtQ3JlYXRvcjogKCB2aWV3OiBMb29wTGlzdCwgaWR4OiBudW1iZXIpPT5Mb29wTGlzdEl0ZW0gPSBudWxsXHJcbiAgICBwcml2YXRlIF90b3RhbGNvdW50OiBudW1iZXIgPSAwXHJcbiAgICAvLy8gY3VycmVudCBkaXNwbGF5IGl0ZW1cclxuICAgIHByaXZhdGUgX2l0ZW1zOiBMb29wTGlzdEl0ZW1bXSA9IFtdXHJcbiAgICAvLy8gbWF4IHBhZGRpbmcg5Yy65YiG5Zue5pS26L6555WM5ZKM5Yib5bu66L6555WMIOmBv+WFjXBhZGRpbmcg6YCg5oiQ55qE6YeN5aSN5Yib5bu65ZKM5Zue5pS2XHJcbiAgICBwcml2YXRlIF9tYXhQYWRkaW5nOiBudW1iZXIgPSAwXHJcblxyXG4gICAgLy8vIOe8k+WtmOi+ueeVjCByZWN5Y2xlICYgY3JlYXRlIGl0ZW0gYm91bmRhcnlcclxuICAgIHByaXZhdGUgbGVmdEJvdW5kYXJ5OiBudW1iZXIgPSAwXHJcbiAgICBwcml2YXRlIHJpZ2h0Qm91bmRhcnk6IG51bWJlciA9IDBcclxuICAgIHByaXZhdGUgdG9wQm91bmRhcnk6IG51bWJlciA9IDBcclxuICAgIHByaXZhdGUgYm90dG9tQm91bmRhcnk6IG51bWJlciA9IDBcclxuICAgIC8vLyDkuIrkuIvlt6blj7PovrnnlYxcclxuICAgIHByaXZhdGUgX2xlZnRCb3VuZGFyeTogbnVtYmVyICAgPSAwXHJcbiAgICBwcml2YXRlIF9ib3R0b21Cb3VuZGFyeTogbnVtYmVyID0gMCBcclxuICAgIHByaXZhdGUgX3JpZ2h0Qm91bmRhcnk6IG51bWJlciAgPSAwXHJcbiAgICBwcml2YXRlIF90b3BCb3VuZGFyeTogbnVtYmVyICAgID0gMFxyXG4gICAgLy8vIOagh+iusGl0ZW0gc2l6ZSDmmK/lkKblj5jljJZcclxuICAgIHByaXZhdGUgX2l0ZW1TaXplRGlydHk6IGJvb2xlYW4gPSB0cnVlXHJcbiAgICAvLy8g5qCH6K6waXRlbSDmmK/lkKbpnIDopoHmm7TmlrDvvIjliJvlu7rmiJblm57mlLbvvIlcclxuICAgIHByaXZhdGUgX2l0ZW1EaXJ0eTogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICAvLy8g5ruR5Yqo56e75Yqo5pe255So5Yiw55qE5o6n5Yi25Y+Y6YePIOWxleekuml0ZW0g5YiwaWR4XHJcbiAgICBwcml2YXRlIGFuaW1lSWR4OiBudW1iZXIgPSAwXHJcbiAgICBwcml2YXRlIGJBbmltZU1vdmVpbmc6IGJvb2xlYW4gPSBmYWxzZVxyXG5cclxuICAgIC8vLyDop4blj6NcclxuICAgIEBwcm9wZXJ0eSggY2MuU2Nyb2xsVmlldylcclxuICAgIHByaXZhdGUgc2Nyb2xsVmlldzogY2MuU2Nyb2xsVmlldyA9IG51bGxcclxuICAgIGdldCBjb250ZW50KCk6IGNjLk5vZGUgeyByZXR1cm4gdGhpcy5zY3JvbGxWaWV3LmNvbnRlbnR9XHJcbiAgICBnZXQgdmlld1BvcnQoKTpjYy5Ob2RlIHsgcmV0dXJuIHRoaXMuY29udGVudC5wYXJlbnR9XHJcblxyXG4gICAgb25Mb2FkKCl7XHJcbiAgICAgICAgLy8vIOWPquWFgeiuuOS4gOS4quaWueWQkVxyXG4gICAgICAgIGlmKCB0aGlzLnNjcm9sbFZpZXcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcgPSB0aGlzLmdldENvbXBvbmVudCggY2MuU2Nyb2xsVmlldylcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOmHjee9rnNjcm9sbHZpZXcg5rua5Yqo5bGe5oCnXHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Lmhvcml6b250YWwgPSB0aGlzLm1vdmVtZW50ID09IE1vdmVtZW50Lkhvcml6b250YWxcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcudmVydGljYWwgPSB0aGlzLm1vdmVtZW50ID09IE1vdmVtZW50LlZlcnRpY2FsXHJcbiAgICAgICAgLy8vIOmHjeWumuWQkXNjcm9sbHZpZXcg5Ye95pWwXHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Ll9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5LmJpbmQodGhpcylcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX2NhbGN1bGF0ZUJvdW5kYXJ5ID0gdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkuYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5fY2xhbXBEZWx0YSA9IHRoaXMuX2NsYW1wRGVsdGEuYmluZCh0aGlzKVxyXG4gICAgICAgIGlmKCB0aGlzLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgLy8vIGluaXRpYWxpemUgY29udGVudCB2aWV3XHJcbiAgICAgICAgICAgIGxldCBhbmNoID0gdGhpcy5zY3JvbGxWaWV3Lmhvcml6b250YWw/IGNjLnYyKCAwLCAwLjUpOiBjYy52MiggMC41LCAxKVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuc2V0QW5jaG9yUG9pbnQoIGFuY2gpIFxyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuc2V0UG9zaXRpb24oIGNjLlZlYzIuWkVSTylcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGluaXRpYWxpemUgZGF0YVxyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5KClcclxuICAgIH1cclxuXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5ub2RlLm9uKCBcInNjcm9sbGluZ1wiLCB0aGlzLm9uU2Nyb2xsaW5nLCB0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5ub2RlLm9mZiggXCJzY3JvbGxpbmdcIiwgdGhpcy5vblNjcm9sbGluZywgdGhpcylcclxuICAgIH1cclxuXHJcbiAgICAvLy8gaW5pdGlhbGl6ZSB0b3RhbCBjb3VudCwgaXRlbSBjcmVhdG9yXHJcbiAgICBpbml0aWFsaXplKGNyZWF0b3I6KCB2aWV3OiBMb29wTGlzdCwgaWR4OiBudW1iZXIpPT5Mb29wTGlzdEl0ZW0sIGNvdW50OiBudW1iZXIgPSAwKXtcclxuICAgICAgICB0aGlzLl90b3RhbGNvdW50ID0gY291bnQgfHwgMFxyXG4gICAgICAgIHRoaXMuX2l0ZW1DcmVhdG9yID0gY3JlYXRvclxyXG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVQb29sKClcclxuICAgICAgICB0aGlzLl91cGRhdGVMaXN0VmlldygpIFxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDorr7nva7lvZPliY1pdGVtIGNvdW50IOWmguaenOS4jeaYr+W8uuWItlJlc2V0XHJcbiAgICAvLy8g6YKj5LmI5aSn5LqO562J5LqO5b2T5YmNaXRlbWNvdXQgfHwg5pyA5ZCO5LiA6aG5aXRlbeS4jeaYryDlvZPliY1pdGVtIOiHquWKqOS9v+eUqOWIt+aWsOaWueW8j+S4jeS8muS/ruaUueW9k+WJjWl0ZW0g55qE5pi+56S65L2N572uXHJcbiAgICBzZXRJdGVtQ291bnQoIGNvdW50OiBudW1iZXIsIGJSZXNldDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IG9sZGNvdW50ID0gdGhpcy5fdG90YWxjb3VudFxyXG4gICAgICAgIHRoaXMuX3RvdGFsY291bnQgPSBjb3VudFxyXG4gICAgICAgIGlmKCBiUmVzZXQpIHsgXHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vLyDlpoLmnpzmlrDnmoRpdGVtIGNvdW50IOWkp+S6jiBvbGRJdGVtY291bnTpgqPkuYjlpKfkuo7nrYnkuo7lvZPliY1pdGVtY291dFxyXG4gICAgICAgICAgICBsZXQgbGFzdEl0ZW0gPSB0aGlzLl9pdGVtcy5sZW5ndGggPiAwPyB0aGlzLl9pdGVtc1sgdGhpcy5faXRlbXMubGVuZ3RoLTFdOiBudWxsXHJcbiAgICAgICAgICAgIGlmKCBjb3VudCA+PSBvbGRjb3VudCB8fCAobGFzdEl0ZW0gIT0gbnVsbCAmJiBsYXN0SXRlbS5pdGVtSWR4IDwgKGNvdW50IC0xKSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaEl0ZW1zKClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0l0ZW0oIGNvdW50IC0gMSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICBcclxuICAgIC8vLyDliLfmlrDlvZPliY3miYDmnIlpdGVtXHJcbiAgICByZWZyZXNoSXRlbXMoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX3RvdGFsY291bnQgPiAwICYmIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGZyaXN0SXRlbSAgID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgbGV0IHBvcyAgICAgICAgID0gZnJpc3RJdGVtLm5vZGUucG9zaXRpb25cclxuICAgICAgICAgICAgbGV0IGl0ZW1JZHggICAgID0gZnJpc3RJdGVtLml0ZW1JZHhcclxuICAgICAgICAgICAgLy8vIGNyZWF0ZSB0b3AgaXRlbVxyXG4gICAgICAgICAgICB0aGlzLl9yZWN5Y2xlQWxsSXRlbXMoKVxyXG4gICAgICAgICAgICBsZXQgYXJnID0gdGhpcy5tb3ZlbWVudCA9PSBNb3ZlbWVudC5Ib3Jpem9udGFsPyBwb3MueDogcG9zLnlcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoIGl0ZW1JZHgsIGFyZylcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWN5Y2xlQWxsSXRlbXMoIHRydWUpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0l0ZW0oIGlkeDogbnVtYmVyLCBiQW5pbWU6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIC8vIOmZkOWumuWIsCAwIC0g77yIdG90YWxjb3VudCAtMe+8ieiMg+WbtOWGhVxyXG4gICAgICAgIGlkeCA9IE1hdGgubWluKCB0aGlzLl90b3RhbGNvdW50IC0gMSwgTWF0aC5tYXgoMCwgaWR4KSkgXHJcbiAgICAgICAgaWYoIGJBbmltZSkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuc3RvcEF1dG9TY3JvbGwoKVxyXG4gICAgICAgICAgICB0aGlzLmFuaW1lSWR4ID0gaWR4O1xyXG4gICAgICAgICAgICB0aGlzLmJBbmltZU1vdmVpbmcgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vLyDlm57mlLbmiYDmnIlpdGVtcyDku47mlrDliJvlu7p0b3AgaXRlbVxyXG4gICAgICAgICAgICBzd2l0Y2goIHRoaXMubW92ZW1lbnQpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5Ib3Jpem9udGFsOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Nob3dJdGVtSG9yKCBpZHgpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuVmVydGljYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd0l0ZW1WZXIoIGlkeClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDojrflj5bkuIDkuKppdGVtIFxyXG4gICAgZ2V0TmV3SXRlbSgga2V5OiBzdHJpbmcgPSBudWxsKTogTG9vcExpc3RJdGVtIHtcclxuICAgICAgICBrZXkgPSBrZXkgfHwgdGhpcy5fdGVtcGxhdGVcclxuICAgICAgICBsZXQgcG9vbCA9IHRoaXMuX2l0ZW1Qb29sW2tleV1cclxuICAgICAgICBsZXQgaW5zdGFuY2U6IExvb3BMaXN0SXRlbSA9IChwb29sICYmIHBvb2wubGVuZ3RoID4gMCk/IHBvb2wucG9wKCk6IG51bGxcclxuICAgICAgICBpZiAoIGluc3RhbmNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IHByZWZhYiA9IHRoaXMuX3RlbXBsYXRlc1trZXldXHJcbiAgICAgICAgICAgIGlmKCBwcmVmYWIgIT0gbnVsbCkgeyBcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gY2MuaW5zdGFudGlhdGUoIHByZWZhYi5ub2RlKSBcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlID0gbm9kZS5nZXRDb21wb25lbnQoIExvb3BMaXN0SXRlbSlcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLml0ZW1LZXkgPSBrZXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VcclxuICAgIH1cclxuXHJcbiAgICBpdGVtU2l6ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBvblNjcm9sbGluZygpIHtcclxuICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoIGR0OiBudW1iZXIpIHtcclxuICAgICAgICAvLy8g5Yqo55S756e75YqoXHJcbiAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gdGhpcy5fc2Nyb2xsaW5nPyBmYWxzZTogdGhpcy5iQW5pbWVNb3ZlaW5nXHJcbiAgICAgICAgc3dpdGNoKCB0aGlzLm1vdmVtZW50KXtcclxuICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5Ib3Jpem9udGFsOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSAmJiB0aGlzLl91cGRhdGVIb3Jpem9udGFsSXRlbXMoKSAvLy8gY2hlY2sgaXRlbSBzaXplIGRpcnR5XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJBbmltZU1vdmVpbmcgJiYgdGhpcy5fc2Nyb2xsVG9JdGVtSG9yKCB0aGlzLmFuaW1lSWR4KSAvLy8gY2hlY2sgYXV0byBtb3ZlaW5nXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50LlZlcnRpY2FsOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSAmJiB0aGlzLl91cGRhdGVWZXJ0aWNhbEl0ZW1zKClcclxuICAgICAgICAgICAgICAgIHRoaXMuYkFuaW1lTW92ZWluZyAmJiB0aGlzLl9zY3JvbGxUb0l0ZW1WZXIoIHRoaXMuYW5pbWVJZHgpXHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pdGVtU2l6ZURpcnR5ID0gZmFsc2VcclxuICAgICAgICAvLy8gY3JlYXRlIHx8IHJlY3ljbGUgaXRlbVxyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtRGlydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gZmFsc2VcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbml0aWFsaXplUG9vbCgpIHtcclxuICAgICAgICBpZiggdGhpcy5faXRlbVBvb2wgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pdGVtUG9vbCA9IHt9XHJcbiAgICAgICAgICAgIGxldCBwcmVmYWJzID0gdGhpcy5jb250ZW50LmdldENvbXBvbmVudHNJbkNoaWxkcmVuKCBMb29wTGlzdEl0ZW0pXHJcbiAgICAgICAgICAgIHByZWZhYnMuZm9yRWFjaCggaXRlbT0+e1xyXG4gICAgICAgICAgICAgICAgLy8vIHNhdmUgdGVtcGxhdGVzIFxyXG4gICAgICAgICAgICAgICAgbGV0IGtleSA9IGl0ZW0uaXRlbUtleSA9IGl0ZW0ubm9kZS5uYW1lXHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSAgICAgICAgICA9IHRoaXMuX3RlbXBsYXRlID09IG51bGw/IGtleTogdGhpcy5fdGVtcGxhdGVcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlc1trZXldICAgID0gaXRlbVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF4UGFkZGluZyAgICAgICAgPSBNYXRoLm1heCggdGhpcy5fbWF4UGFkZGluZywgaXRlbS5wYWRkaW5nKzIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCBpdGVtKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldENvbnRlbnRQb3NpdGlvbiggcG9zOiBjYy5WZWMyKXtcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuc3RvcEF1dG9TY3JvbGwoKVxyXG4gICAgICAgIGlmKCB0aGlzLnNjcm9sbFZpZXcuY29udGVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuY29udGVudC5wb3NpdGlvbiA9IHBvc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zaG93SXRlbVZlciggaWR4OiBudW1iZXIpIHtcclxuICAgICAgICAvLy8g5Yik5pat6ZyA6KaB546w5a6e55qEaXRlbeWSjOacgOWQjuS4gOS4qumDveWcqOeql+WPo+WGheWwseS4jeeUqOaJp+ihjOS6hlxyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBmcmlzdCA9IHRoaXMuX2dldEl0ZW1BdCggaWR4KVxyXG4gICAgICAgICAgICBsZXQgbGFzdCA9IHRoaXMuX2l0ZW1zW3RoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICAgICAgaWYoIGZyaXN0IT0gbnVsbCAmJiBsYXN0Lml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50LTEpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbVRvcCggZnJpc3QpIDw9IHRoaXMuX3RvcEJvdW5kYXJ5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEl0ZW1Cb3R0b20oIGxhc3QpID49IHRoaXMuX2JvdHRvbUJvdW5kYXJ5KXtcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDlm57mlLblvZPliY3miYDmnIlpdGVtICYgcmVzZXQgY29udGVudCBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICBpZiggdGhpcy5fdXBkYXRlTGlzdFZpZXcoIGlkeCkpe1xyXG4gICAgICAgICAgICAvLy8g5Yik5pat5pyA5ZCO5LiA5p2h5piv5ZCm5Zyo56qX5Y+j5YaF6YOo6ZyA6KaB6Z2g56qX5Y+j5bqV6YOoXHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbIHRoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tID0gdGhpcy5fZ2V0SXRlbUJvdHRvbSggaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmKCBib3R0b20gPiB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC55ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgLSBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICAvLy8g56e75Yqo56qX5Y+j5ZCO6ZyA6KaB6YeN5paw5Yqg6L296aG26YOoaXRlbSAmXHJcbiAgICAgICAgICAgICAgICAgICAgLy8vIOWIpOaWrSB0b3BpdGVtIOaYr+WQpuWcqOmhtumDqOi+ueeVjOmHjOmdouWOu+S6hlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldygpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRpdGVtLml0ZW1JZHggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLl9nZXRJdGVtVG9wKCB0aXRlbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0b3AgPCB0aGlzLl90b3BCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC55ID0gdGhpcy5jb250ZW50LnkgKyAodGhpcy5fdG9wQm91bmRhcnkgLSB0b3ApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8vIOagh+iusGl0ZW0g6ZyA6KaB6YeN5paw5Yib5bu65Zue5pS2XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Nob3dJdGVtSG9yKCBpZHg6IG51bWJlcil7XHJcbiAgICAgICAgLy8vIOWIpOaWremcgOimgeaYvuekuueahGl0ZW3lkozmnIDlkI7kuIDkuKrpg73lnKjnqpflj6PlhoXlsLHkuI3nlKjmiafooYzkuoZcclxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgZnJpc3QgPSB0aGlzLl9nZXRJdGVtQXQoIGlkeClcclxuICAgICAgICAgICAgbGV0IGxhc3QgPSB0aGlzLl9pdGVtc1t0aGlzLl9pdGVtcy5sZW5ndGggLTFdXHJcbiAgICAgICAgICAgIGlmKCBmcmlzdCE9IG51bGwgJiYgbGFzdC5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudC0xKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEl0ZW1MZWZ0KCBmcmlzdCkgPj0gdGhpcy5fbGVmdEJvdW5kYXJ5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEl0ZW1SaWdodCggbGFzdCkgPD0gdGhpcy5fcmlnaHRCb3VuZGFyeSl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8g5Zue5pS25b2T5YmN5omA5pyJaXRlbSAmIHJlc2V0IGNvbnRlbnQgcG9zaXRpb25cclxuICAgICAgICB0aGlzLl9yZWN5Y2xlQWxsSXRlbXMoIHRydWUpXHJcbiAgICAgICAgaWYoIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCBpZHgpKSB7XHJcbiAgICAgICAgICAgIC8vLyDliKTmlq3mnIDlkI7kuIDmnaHmmK/lkKblnKjnqpflj6PlhoXpg6jpnIDopoHpnaDnqpflj6Plj7PovrlcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1sgdGhpcy5faXRlbXMubGVuZ3RoIC0xXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKXtcclxuICAgICAgICAgICAgICAgIGxldCByaWdodCA9IHRoaXMuX2dldEl0ZW1SaWdodCggaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmKCByaWdodCA8IHRoaXMuX3JpZ2h0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQueCA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgLSByaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIC8vLyDliKTmlq0gbGVmdGl0ZW0g5piv5ZCm5Zyo5bem6L6555WM6L6555WM6YeM6Z2i5Y675LqGXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdGl0ZW0uaXRlbUlkeCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxlZnQgPSB0aGlzLl9nZXRJdGVtTGVmdCggdGl0ZW0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggbGVmdCA+IHRoaXMuX2xlZnRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC54ID0gdGhpcy5jb250ZW50LnggLSAobGVmdCAtIHRoaXMuX2xlZnRCb3VuZGFyeSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLy8g5qCH6K6waXRlbSDpnIDopoHph43mlrDliJvlu7rlm57mlLZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2Nyb2xsVG9JdGVtSG9yKCBpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fZ2V0SXRlbUF0KCBpZHgpXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDBcclxuICAgICAgICBpZiggaXRlbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX2l0ZW1zWzBdLml0ZW1JZHggPiBpZHg/IHRoaXMuc2Nyb2xsU3BlZWRNYXg6IC10aGlzLnNjcm9sbFNwZWVkTWF4XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5fbGVmdEJvdW5kYXJ5IC0gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmKCBpZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0gMSkpIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgLSB0aGlzLl9nZXRJdGVtUmlnaHQoIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXQgPj0gMD8gMDogb2Zmc2V0XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFzdCA9IHRoaXMuX2l0ZW1zWyB0aGlzLl9pdGVtcy5sZW5ndGggLSAxXVxyXG4gICAgICAgICAgICAgICAgaWYoIGxhc3QuaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSAmJiBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtUmlnaHQoIGxhc3QpIDw9IHRoaXMuX3JpZ2h0Qm91bmRhcnkpICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gMFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDliKTmlq3mmK/lkKbkuLowXHJcbiAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gTWF0aC5hYnMoIG9mZnNldCkgPiBFUFNJTE9OXHJcbiAgICAgICAgaWYoIG9mZnNldCA+IHRoaXMuc2Nyb2xsU3BlZWRNYXggfHwgb2Zmc2V0IDwgLXRoaXMuc2Nyb2xsU3BlZWRNYXgpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5taW4oIHRoaXMuc2Nyb2xsU3BlZWRNYXgsIE1hdGgubWF4KCAtdGhpcy5zY3JvbGxTcGVlZE1heCwgb2Zmc2V0KSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLy8g5YGa5Liq57q/5oCn5o+S5YC85pu05bmz5ruRXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBvZmZzZXQgIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX21vdmVDb250ZW50KCBjYy52Miggb2Zmc2V0LCAwKSwgdHJ1ZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuc3RvcEF1dG9TY3JvbGwoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zY3JvbGxUb0l0ZW1WZXIoIGlkeDogbnVtYmVyKXtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2dldEl0ZW1BdCggaWR4KVxyXG4gICAgICAgIGxldCBvZmZzZXQgPSAwXHJcbiAgICAgICAgaWYoIGl0ZW0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSB0aGlzLl9pdGVtc1swXS5pdGVtSWR4ID4gaWR4PyAtdGhpcy5zY3JvbGxTcGVlZE1heDogdGhpcy5zY3JvbGxTcGVlZE1heFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX3RvcEJvdW5kYXJ5IC0gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSlcclxuICAgICAgICAgICAgaWYoIGlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgLSB0aGlzLl9nZXRJdGVtQm90dG9tKCBpdGVtKSBcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IG9mZnNldCA8PSAwPyAwOiBvZmZzZXRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBsYXN0ID0gdGhpcy5faXRlbXNbIHRoaXMuX2l0ZW1zLmxlbmd0aCAtIDFdXHJcbiAgICAgICAgICAgICAgICBpZiggbGFzdC5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpICYmIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dldEl0ZW1Cb3R0b20oIGxhc3QpIDw9IHRoaXMuX3JpZ2h0Qm91bmRhcnkpICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gMFxyXG4gICAgICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8g5Yik5pat5piv5ZCm5Li6MFxyXG4gICAgICAgIHRoaXMuYkFuaW1lTW92ZWluZyA9IE1hdGguYWJzKCBvZmZzZXQpID4gRVBTSUxPTlxyXG4gICAgICAgIGlmKCBvZmZzZXQgPiB0aGlzLnNjcm9sbFNwZWVkTWF4IHx8IG9mZnNldCA8IC10aGlzLnNjcm9sbFNwZWVkTWF4KSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IE1hdGgubWluKCB0aGlzLnNjcm9sbFNwZWVkTWF4LCBNYXRoLm1heCggLXRoaXMuc2Nyb2xsU3BlZWRNYXgsIG9mZnNldCkpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8vIOWBmuS4que6v+aAp+aPkuWAvOabtOW5s+a7kVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggb2Zmc2V0ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1EaXJ0eSA9IHRydWVcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxWaWV3Ll9tb3ZlQ29udGVudCggY2MudjIoIDAsIG9mZnNldCksIHRydWUpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxWaWV3LnN0b3BBdXRvU2Nyb2xsKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVjeWNsZShpdGVtOiBMb29wTGlzdEl0ZW0pIHtcclxuICAgICAgICBsZXQgcG9vbCA9IHRoaXMuX2l0ZW1Qb29sW2l0ZW0uaXRlbUtleV1cclxuICAgICAgICBpZiggcG9vbCA9PSBudWxsKSB7IHBvb2wgPSB0aGlzLl9pdGVtUG9vbFtpdGVtLml0ZW1LZXldID0gW10gfVxyXG4gICAgICAgIGl0ZW0ubm9kZS5hY3RpdmUgPSBmYWxzZVxyXG4gICAgICAgIGl0ZW0ubG9vcGxpc3QgPSBudWxsXHJcbiAgICAgICAgcG9vbC5wdXNoKCBpdGVtKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9yZWN5Y2xlQWxsSXRlbXMoIHJlc2V0OmJvb2xlYW4gPSBmYWxzZSl7XHJcbiAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCggaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIGl0ZW0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5faXRlbXMgPSBbXVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5zdG9wQXV0b1Njcm9sbCgpXHJcbiAgICAgICAgcmVzZXQgJiYgdGhpcy5zZXRDb250ZW50UG9zaXRpb24oIGNjLlZlYzIuWkVSTylcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVOZXdJdGVtKCBpZHg6IG51bWJlcik6IExvb3BMaXN0SXRlbSB7XHJcbiAgICAgICAgaWYoIGlkeCA8IDAgfHwgaWR4ID49IHRoaXMuX3RvdGFsY291bnQpIHJldHVybiBudWxsIFxyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbUNyZWF0b3I/IHRoaXMuX2l0ZW1DcmVhdG9yKCB0aGlzLCBpZHgpIDogbnVsbFxyXG4gICAgICAgIGlmKCBpdGVtICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaXRlbS5ub2RlLnBvc2l0aW9uID0gY2MuVmVjMi5aRVJPOyBpdGVtLml0ZW1JZHggPSBpZHg7IFxyXG4gICAgICAgICAgICBpdGVtLm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgaXRlbS5sb29wbGlzdCA9IHRoaXM7IFxyXG4gICAgICAgICAgICBpdGVtLm5vZGUucGFyZW50ID0gdGhpcy5jb250ZW50XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbUF0KCBpZHg6IG51bWJlcik6IExvb3BMaXN0SXRlbXtcclxuICAgICAgICBmb3IoIGxldCBpPTA7IGk8dGhpcy5faXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1tpXSBcclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PSBpZHgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGxcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRJdGVtVG9wKCBpdGVtOiBMb29wTGlzdEl0ZW0pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBpdGVtLm5vZGUueSArIHRoaXMuY29udGVudC55XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbUJvdHRvbSggaXRlbTogTG9vcExpc3RJdGVtKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgaXRlbXRvcCA9IHRoaXMuX2dldEl0ZW1Ub3AoIGl0ZW0pXHJcbiAgICAgICAgcmV0dXJuIGl0ZW10b3AgLSBpdGVtLm5vZGUuaGVpZ2h0IFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEl0ZW1MZWZ0KCBpdGVtOiBMb29wTGlzdEl0ZW0pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBpdGVtLm5vZGUueCArIHRoaXMuY29udGVudC54IC8vICsgaXRlbS5vZmZzZXRcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRJdGVtUmlnaHQoIGl0ZW06IExvb3BMaXN0SXRlbSk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IGl0ZW1MZWZ0ID0gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1MZWZ0ICsgaXRlbS5ub2RlLndpZHRoXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlTGlzdFZpZXcoIGlkeDogbnVtYmVyID0gMCwgcG9zOiBudW1iZXIgPSBudWxsKSB7XHJcbiAgICAgICAgLy8vIGN1ciBjb3VudFxyXG4gICAgICAgIGxldCBjaGVja2NvdW50ID0gMFxyXG4gICAgICAgIGxldCBjcmVhdGUgPSB0aGlzLm1vdmVtZW50ID09PSBNb3ZlbWVudC5Ib3Jpem9udGFsPyB0aGlzLl91cGRhdGVIb3Jpem9udGFsOiB0aGlzLl91cGRhdGVWZXJ0aWNhbFxyXG4gICAgICAgIHdoaWxlKCBjcmVhdGUuY2FsbCggdGhpcywgaWR4LCBwb3MpKSB7XHJcbiAgICAgICAgICAgIGlmKCArK2NoZWNrY291bnQgPj0gdGhpcy5mcmFtZUNyZWF0ZU1heCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlVG9wSXRlbSggaWR4OiBudW1iZXIsIHk6IG51bWJlciA9IG51bGwpOiBMb29wTGlzdEl0ZW0ge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggaWR4KVxyXG4gICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmKCB5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gLXRoaXMuX2dldEl0ZW1Ub3AoIGl0ZW0pICsgdGhpcy5fdG9wQm91bmRhcnkgLSBpdGVtLm9mZnNldFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSB5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgIH1cclxuXHJcbiAgICAvLy8g5LuO5paw5o6S5bqPaXRlbXNcclxuICAgIHByaXZhdGUgX3VwZGF0ZVZlcnRpY2FsSXRlbXMoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgbGV0IHBpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgZm9yKCBsZXQgaWR4PTE7IGlkeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgaWR4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1tpZHhdXHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHBpdGVtLm5vZGUueSAtIHBpdGVtLm5vZGUuaGVpZ2h0IC0gaXRlbS5wYWRkaW5nXHJcbiAgICAgICAgICAgICAgICBwaXRlbSA9IGl0ZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVWZXJ0aWNhbCggaWR4OiBudW1iZXIsIHBvczogbnVtYmVyKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxyXG4gICAgICAgIC8vLyByZWN5Y2xlIGFsbCBpdGVtc1xyXG4gICAgICAgIGlmKCB0aGlzLl90b3RhbGNvdW50ID09IDAgJiYgY3VyQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBmaWxsIHVwICYgZmlsbCBkb3duXHJcbiAgICAgICAgaWYoIGN1ckNvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlVG9wSXRlbSggaWR4LCBwb3MpXHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIHJlY3ljbGUgdG9wIGl0ZW0g5Zue5pS26aG26YOo5pWw5o2uIOWmguaenOacgOW6leS4i+eahGl0ZW0g5piv5pyA5ZCO5LiA5p2h6YKj5LmI5LiN5Zue5pS25LiK6Z2i55qEaXRlbVxyXG4gICAgICAgIGxldCB0b3BpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgYm90dG9taXRlbSA9IHRoaXMuX2l0ZW1zWyBjdXJDb3VudC0xXVxyXG4gICAgICAgIGxldCBib3R0b21fYm90dG9tID0gdGhpcy5fZ2V0SXRlbUJvdHRvbSggYm90dG9taXRlbSlcclxuICAgICAgICBpZiggY3VyQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHRvcCBpdGVtXHJcbiAgICAgICAgICAgIGxldCBjYW5SZWN5Y2xlVG9wID0gKGJvdHRvbWl0ZW0uaXRlbUlkeCAhPT0gdGhpcy5fdG90YWxjb3VudC0xIHx8IGJvdHRvbV9ib3R0b20gPCB0aGlzLl9ib3R0b21Cb3VuZGFyeSlcclxuICAgICAgICAgICAgaWYoIGNhblJlY3ljbGVUb3AgJiYgdGhpcy5fZ2V0SXRlbUJvdHRvbSggdG9waXRlbSkgPiAodGhpcy50b3BCb3VuZGFyeSArIHRoaXMuX21heFBhZGRpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCB0b3BpdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgLy8vIHJlY3ljbGUgYm90dG9tIGl0ZW1cclxuICAgICAgICAgICAgaWYoIHRvcGl0ZW0uaXRlbUlkeCA+IDAgJiYgdGhpcy5fZ2V0SXRlbVRvcCggYm90dG9taXRlbSkgPCAodGhpcy5ib3R0b21Cb3VuZGFyeSAtIHRoaXMuX21heFBhZGRpbmcpKSB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCBjdXJDb3VudC0xLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggYm90dG9taXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSB0b3AgaXRlbVxyXG4gICAgICAgIGlmKCB0aGlzLl9nZXRJdGVtVG9wKCB0b3BpdGVtKSA8IHRoaXMudG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCB0b3BpdGVtLml0ZW1JZHggLSAxKVxyXG4gICAgICAgICAgICBpZiggaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSB0b3BpdGVtLm5vZGUueSArIGl0ZW0ucGFkZGluZyArIGl0ZW0ubm9kZS5oZWlnaHRcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbVxyXG4gICAgICAgIGlmKCBib3R0b21fYm90dG9tID4gdGhpcy5ib3R0b21Cb3VuZGFyeSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIGJvdHRvbWl0ZW0uaXRlbUlkeCArIDEpXHJcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IGJvdHRvbWl0ZW0ubm9kZS55IC0gYm90dG9taXRlbS5ub2RlLmhlaWdodCAtIGJvdHRvbWl0ZW0ucGFkZGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY3JlYXRlTGVmdEl0ZW0oIGlkeDogbnVtYmVyLCB4Om51bWJlciA9IG51bGwpIDogTG9vcExpc3RJdGVte1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggaWR4KVxyXG4gICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgIGlmKCB4ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gLXRoaXMuX2dldEl0ZW1MZWZ0KCBpdGVtKSArIHRoaXMuX2xlZnRCb3VuZGFyeSArIGl0ZW0ub2Zmc2V0XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IHhcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pdGVtcy5wdXNoKCBpdGVtKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZUhvcml6b250YWxJdGVtcygpe1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIGxldCBwcmVpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgZm9yKCBsZXQgaWR4PTE7IGlkeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgaWR4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1tpZHhdXHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IHByZWl0ZW0ubm9kZS54ICsgcHJlaXRlbS5ub2RlLmhlaWdodCArIGl0ZW0ucGFkZGluZ1xyXG4gICAgICAgICAgICAgICAgcHJlaXRlbSA9IGl0ZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVIb3Jpem9udGFsKCBpZHg6IG51bWJlciwgcG9zOiBudW1iZXIpOiBib29sZWFue1xyXG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxyXG4gICAgICAgIC8vLyByZWN5Y2xlIGFsbCBpdGVtc1xyXG4gICAgICAgIGlmKCB0aGlzLl90b3RhbGNvdW50ID09IDAgJiYgY3VyQ291bnQgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBmaWxsIHVwICYgZmlsbCBkb3duXHJcbiAgICAgICAgaWYoIGN1ckNvdW50ID09IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVMZWZ0SXRlbSggaWR4LCBwb3MpXHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9IG51bGw/IHRydWU6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBmaWxsIGxlZnQgJiBmaWxsIHJpZ2h0XHJcbiAgICAgICAgbGV0IGxlZnRJdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgcmlnaHRJdGVtID0gdGhpcy5faXRlbXNbIGN1ckNvdW50LTFdXHJcbiAgICAgICAgbGV0IHJpZ2h0X3JpZ2h0ID0gdGhpcy5fZ2V0SXRlbVJpZ2h0KCByaWdodEl0ZW0pXHJcbiAgICAgICAgaWYoIGN1ckNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAvLy8gcmVjeWNsZSBsZWZ0IGl0ZW1cclxuICAgICAgICAgICAgbGV0IGNhblJlY3ljbGVMZWZ0ID0gKHJpZ2h0SXRlbS5pdGVtSWR4ICE9PSAodGhpcy5fdG90YWxjb3VudCAtIDEpIHx8IHJpZ2h0X3JpZ2h0ID4gdGhpcy5yaWdodEJvdW5kYXJ5KVxyXG4gICAgICAgICAgICBpZiggY2FuUmVjeWNsZUxlZnQgJiYgdGhpcy5fZ2V0SXRlbVJpZ2h0KCBsZWZ0SXRlbSkgPCAodGhpcy5sZWZ0Qm91bmRhcnkgLSB0aGlzLl9tYXhQYWRkaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggbGVmdEl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHJpZ2h0IGl0ZW1cclxuICAgICAgICAgICAgaWYoIGxlZnRJdGVtLml0ZW1JZHggPiAwICYmIHRoaXMuX2dldEl0ZW1MZWZ0KHJpZ2h0SXRlbSkgPiAodGhpcy5yaWdodEJvdW5kYXJ5ICsgdGhpcy5fbWF4UGFkZGluZykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggY3VyQ291bnQtMSwgMSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIHJpZ2h0SXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBsZWZ0IGl0ZW1cclxuICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbUxlZnQoIGxlZnRJdGVtKSA+IHRoaXMubGVmdEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggbGVmdEl0ZW0uaXRlbUlkeCAtIDEpXHJcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IGxlZnRJdGVtLm5vZGUueCAtIGl0ZW0ubm9kZS53aWR0aCAtIGl0ZW0ucGFkZGluZyBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbVxyXG4gICAgICAgIGlmKCByaWdodF9yaWdodCA8IHRoaXMucmlnaHRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIHJpZ2h0SXRlbS5pdGVtSWR4ICsgMSlcclxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gcmlnaHRJdGVtLm5vZGUueCArIHJpZ2h0SXRlbS5ub2RlLndpZHRoICsgcmlnaHRJdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDorqHnrpfovrnnlYwg5LiL6Z2i55qE5Ye95pWw6YO95piv6YeN5YaZc2Nyb2xsdmlldyDljp/mnInnmoTlh73mlbBcclxuICAgIF9jYWxjdWxhdGVCb3VuZGFyeSgpe1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnNldENvbnRlbnRTaXplKCBjYy5zaXplKCB0aGlzLnZpZXdQb3J0LndpZHRoLCB0aGlzLnZpZXdQb3J0LmhlaWdodCkpXHJcbiAgICAgICAgICAgIC8vLyB2aWV3IHBvcnRcclxuICAgICAgICAgICAgbGV0IHZpZXdTaXplID0gdGhpcy52aWV3UG9ydC5nZXRDb250ZW50U2l6ZSgpO1xyXG4gICAgICAgICAgICBsZXQgYW5jaG9yWCA9IHZpZXdTaXplLndpZHRoICogdGhpcy52aWV3UG9ydC5hbmNob3JYO1xyXG4gICAgICAgICAgICBsZXQgYW5jaG9yWSA9IHZpZXdTaXplLmhlaWdodCAqIHRoaXMudmlld1BvcnQuYW5jaG9yWTtcclxuICAgICAgICAgICAgLy8vIOiuoeeul+S4iuS4i+W3puWPs+eql+WPo+i+ueeVjFxyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0Qm91bmRhcnkgID0gLWFuY2hvclg7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdHRvbUJvdW5kYXJ5ID0gLWFuY2hvclk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0Qm91bmRhcnkgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgKyB2aWV3U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fdG9wQm91bmRhcnkgICA9IHRoaXMuX2JvdHRvbUJvdW5kYXJ5ICsgdmlld1NpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLy8g6K6h566X5LiK5LiL5bem5Y+zIOWbnuaUtnzliJvlu7og6L6555WMXHJcbiAgICAgICAgICAgIHRoaXMubGVmdEJvdW5kYXJ5ICAgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSB0aGlzLmNhY2hlQm91bmRhcnlcclxuICAgICAgICAgICAgdGhpcy5yaWdodEJvdW5kYXJ5ICA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgKyB0aGlzLmNhY2hlQm91bmRhcnlcclxuICAgICAgICAgICAgdGhpcy50b3BCb3VuZGFyeSAgICA9IHRoaXMuX3RvcEJvdW5kYXJ5ICsgdGhpcy5jYWNoZUJvdW5kYXJ5XHJcbiAgICAgICAgICAgIHRoaXMuYm90dG9tQm91bmRhcnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIHRoaXMuY2FjaGVCb3VuZGFyeVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coIFwiYm91bmRhcnk6XCIsIHRoaXMuX3RvcEJvdW5kYXJ5LCB0aGlzLl9ib3R0b21Cb3VuZGFyeSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOijgeWJquenu+WKqOmHj1xyXG4gICAgX2NsYW1wRGVsdGEgKGRlbHRhOiBjYy5WZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDA/IGRlbHRhOiBjYy5WZWMyLlpFUk87XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOmHjeWGmeivpeWHveaVsOWunueOsOW3pui+ueeVjOWbnuW8uSBcclxuICAgIC8vLyBwYWdlVmlldyDkuZ/lj6/ku6XlnKjov5nph4zlrp7njrAgJiDpgJrov4fliKTmlq3lvZPliY3mraPlnKh2aWV3cG9ydCDnmoTnrKzkuIDkuKppdGVtIOeEtuWQjui/lOWbnuivpWl0ZW0g55qE5LiOTGVmdEJvdW5kZGFyeeeahOWFs+ezu1xyXG4gICAgX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkgKCl7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pIC0gaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdEJvdW5kYXJ5XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOmHjeWGmeivpeWHveaVsOWunueOsOWPs+i+ueeVjOWbnuW8uVxyXG4gICAgX2dldENvbnRlbnRSaWdodEJvdW5kYXJ5ICgpe1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdXHJcbiAgICAgICAgICAgIGlmKCBpdGVtLml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0xKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW1SaWdodCggaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDkuIrovrnnlYzlm57lvLlcclxuICAgIC8vLyBwYWdlVmlldyDkuZ/lj6/ku6XlnKjov5nph4zlrp7njrAgJiDpgJrov4fliKTmlq3lvZPliY3mraPlnKh2aWV3cG9ydCDnmoTnrKzkuIDkuKppdGVtIOeEtuWQjui/lOWbnuivpWl0ZW0g55qE5LiOTGVmdEJvdW5kZGFyeeeahOWFs+ezu1xyXG4gICAgX2dldENvbnRlbnRUb3BCb3VuZGFyeSAoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSkgKyBpdGVtLm9mZnNldFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90b3BCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDkuIvovrnnlYzlm57lvLlcclxuICAgIF9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkgKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdXHJcbiAgICAgICAgICAgIGlmICggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbUJvdHRvbSggaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tQm91bmRhcnlcclxuICAgIH1cclxuXHJcbiAgICAvLyDph43lhpnor6Xlh73mlbDlrp7njrDovrnnlYzlm57lvLlcclxuICAgIF9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSAoYWRkaXRpb246IGNjLlZlYzIpe1xyXG4gICAgICAgIGFkZGl0aW9uID0gYWRkaXRpb24gfHwgY2MudjIoMCwgMCk7XHJcbiAgICAgICAgLy8g5rOo6YeK6L+Z6KGM5Lya6YCg5oiQ5Zue5by5YnVnXHJcbiAgICAgICAgaWYgKGFkZGl0aW9uLmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSAmJiAhdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3V0T2ZCb3VuZGFyeUFtb3VudCA9IGNjLnYyKDAsIDApO1xyXG4gICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCkge1xyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6IHtcclxuICAgICAgICAgICAgICAgIC8vLyDmsLTlubPmqKHlvI/lt6blj7PovrnnlYxcclxuICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueSA9IDBcclxuICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gdGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpICsgYWRkaXRpb24ueFxyXG4gICAgICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5fZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkoKSArIGFkZGl0aW9uLnhcclxuICAgICAgICAgICAgICAgIGlmKCBsZWZ0ID4gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC54ID0gdGhpcy5fbGVmdEJvdW5kYXJ5IC0gbGVmdFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCByaWdodCA8IHRoaXMuX3JpZ2h0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9yaWdodEJvdW5kYXJ5IC0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBsZWZ0ICsgb3V0T2ZCb3VuZGFyeUFtb3VudC54XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDAgJiYgdGhpcy5faXRlbXNbMF0uaXRlbUlkeCA9PT0gMCAmJiB0ZW1wID49IHRoaXMuX2xlZnRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50LlZlcnRpY2FsOntcclxuICAgICAgICAgICAgICAgIC8vLyAg5Z6C55u05qih5byP5LiK5LiL6L6555WMXHJcbiAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSAwXHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gdGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRvcCA8IHRoaXMuX3RvcEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSB0b3BcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYm90dG9tID4gdGhpcy5fYm90dG9tQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIGJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICAvLy8g5Yik5pat56ys5LiA5p2haXRlbSDokL3kuIvmnaXmmK/lkKbkvJrotoXov4cgdG9wYm91bmRhcnkg5aaC5p6c6LaF6L+H6KaB6YeN5paw6K6h566XXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSB0b3AgKyBvdXRPZkJvdW5kYXJ5QW1vdW50LnlcclxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLl9pdGVtc1swXS5pdGVtSWR4ID09PSAwICYmIHRlbXAgPD0gdGhpcy5fdG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSB0b3BcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDvvJ/vvJ/vvJ9cclxuICAgICAgICBpZiAoYWRkaXRpb24uZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQgPSBvdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudCA9IHRoaXMuX2NsYW1wRGVsdGEob3V0T2ZCb3VuZGFyeUFtb3VudCk7XHJcbiAgICAgICAgcmV0dXJuIG91dE9mQm91bmRhcnlBbW91bnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLyDojrflj5ZzY3JvbGx2aWV3IOeahOengeacieWxnuaAp1xyXG4gICAgZ2V0IF9vdXRPZkJvdW5kYXJ5QW1vdW50KCk6IGNjLlZlYzJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVmlldy5fb3V0T2ZCb3VuZGFyeUFtb3VudFxyXG4gICAgfVxyXG5cclxuICAgIHNldCBfb3V0T2ZCb3VuZGFyeUFtb3VudCh2YWx1ZTogY2MuVmVjMil7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Ll9vdXRPZkJvdW5kYXJ5QW1vdW50ID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSgpOiBib29sZWFue1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFZpZXcuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eVxyXG4gICAgfVxyXG5cclxuICAgIHNldCBfb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KCB2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5ID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX3Njcm9sbGluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFZpZXcuX3Njcm9sbGluZ1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=