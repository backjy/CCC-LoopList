
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
var Movement;
(function (Movement) {
    Movement[Movement["Horizontal"] = 0] = "Horizontal";
    Movement[Movement["Vertical"] = 1] = "Vertical";
})(Movement = exports.Movement || (exports.Movement = {}));
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, disallowMultiple = _a.disallowMultiple;
var LoopList = /** @class */ (function (_super) {
    __extends(LoopList, _super);
    function LoopList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /// 移动方向
        _this.movement = Movement.Vertical;
        _this.cacheBoundary = 20;
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
        _this._itemSizeDirty = false;
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
        this.scrollView.elastic = true; /// 允许超出边界
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
            else {
                console.error("not found template: " + key);
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
        if (this._totalcount == 0) {
            curCount > 0 && this._recycleAllItems(true);
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
        if (this._totalcount == 0) {
            curCount > 0 && this._recycleAllItems(true);
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
        return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQTJDO0FBRTNDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQztBQUFBLENBQUMsQ0FBQTtBQUN0QixJQUFZLFFBR1g7QUFIRCxXQUFZLFFBQVE7SUFDaEIsbURBQVUsQ0FBQTtJQUNWLCtDQUFRLENBQUE7QUFDWixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkI7QUFHSyxJQUFBLGtCQUEyRCxFQUExRCxvQkFBTyxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLHNDQUFpQyxDQUFDO0FBS2xFO0lBQXNDLDRCQUFZO0lBSGxEO1FBQUEscUVBcXRCQztRQWp0QkcsUUFBUTtRQUVSLGNBQVEsR0FBYSxRQUFRLENBQUMsUUFBUSxDQUFDO1FBRzdCLG1CQUFhLEdBQVcsRUFBRSxDQUFBO1FBRzFCLG9CQUFjLEdBQVcsRUFBRSxDQUFBO1FBRzNCLG9CQUFjLEdBQVcsRUFBRSxDQUFBO1FBRXJDLFlBQVk7UUFDRixlQUFTLEdBQW9DLElBQUksQ0FBQTtRQUNqRCxnQkFBVSxHQUFpQyxFQUFFLENBQUE7UUFDN0MsZUFBUyxHQUFXLElBQUksQ0FBQSxDQUFDLGVBQWU7UUFDeEMsa0JBQVksR0FBaUQsSUFBSSxDQUFBO1FBQ2pFLGlCQUFXLEdBQVcsQ0FBQyxDQUFBO1FBQ2pDLHdCQUF3QjtRQUNkLFlBQU0sR0FBbUIsRUFBRSxDQUFBO1FBQ3JDLGdEQUFnRDtRQUN0QyxpQkFBVyxHQUFXLENBQUMsQ0FBQTtRQUVqQyx1Q0FBdUM7UUFDN0Isa0JBQVksR0FBVyxDQUFDLENBQUE7UUFDeEIsbUJBQWEsR0FBVyxDQUFDLENBQUE7UUFDekIsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDdkIsb0JBQWMsR0FBVyxDQUFDLENBQUE7UUFDcEMsVUFBVTtRQUNBLG1CQUFhLEdBQWEsQ0FBQyxDQUFBO1FBQzNCLHFCQUFl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LENBQUE7UUFDL0MsQ0FBQzthQUVELFVBQXlCLEtBQWM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUE7UUFDaEQsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSwrQ0FBeUI7YUFBN0I7WUFDSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUE7UUFDcEQsQ0FBQzthQUVELFVBQStCLEtBQWM7WUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUE7UUFDckQsQ0FBQzs7O09BSkE7SUFNRCxzQkFBSSxnQ0FBVTthQUFkO1lBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQTtRQUNyQyxDQUFDOzs7T0FBQTtJQTlzQkQ7UUFEQyxRQUFRLENBQUUsRUFBQyxJQUFJLEVBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLENBQUM7OENBQ2pCO0lBR3ZDO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7bURBQ2dCO0lBR3BDO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7b0RBQ2U7SUFHckM7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztvREFDaUI7SUFpQ3JDO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0RBQ2lCO0lBN0N6QixRQUFRO1FBSDVCLE9BQU87UUFDUCxnQkFBZ0IsRUFBRTtRQUNsQixJQUFJLENBQUMsc0JBQXNCLENBQUM7T0FDUixRQUFRLENBa3RCNUI7SUFBRCxlQUFDO0NBbHRCRCxBQWt0QkMsQ0FsdEJxQyxFQUFFLENBQUMsU0FBUyxHQWt0QmpEO2tCQWx0Qm9CLFFBQVEiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9vcExpc3RJdGVtICBmcm9tIFwiLi9Mb29wTGlzdEl0ZW1cIjtcclxuXHJcbmNvbnN0IEVQU0lMT04gPSAxZS00OzFcclxuZXhwb3J0IGVudW0gTW92ZW1lbnR7XHJcbiAgICBIb3Jpem9udGFsLFxyXG4gICAgVmVydGljYWwsXHJcbn1cclxuXHJcblxyXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHksIG1lbnUsIGRpc2FsbG93TXVsdGlwbGV9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbkBkaXNhbGxvd011bHRpcGxlKClcclxuQG1lbnUoXCJVSUV4dGVuc2lvbi9Mb29wTGlzdFwiKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb29wTGlzdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcbiAgICAvLy8g56e75Yqo5pa55ZCRXHJcbiAgICBAcHJvcGVydHkoIHt0eXBlOmNjLkVudW0oTW92ZW1lbnQpLCBzZXJpYWxpemFibGU6IHRydWV9KVxyXG4gICAgbW92ZW1lbnQ6IE1vdmVtZW50ID0gTW92ZW1lbnQuVmVydGljYWw7XHJcblxyXG4gICAgQHByb3BlcnR5KCBjYy5GbG9hdClcclxuICAgIHByb3RlY3RlZCBjYWNoZUJvdW5kYXJ5OiBudW1iZXIgPSAyMFxyXG5cclxuICAgIEBwcm9wZXJ0eSggY2MuSW50ZWdlcilcclxuICAgIHByb3RlY3RlZCBmcmFtZUNyZWF0ZU1heDogbnVtYmVyID0gMzBcclxuXHJcbiAgICBAcHJvcGVydHkoIGNjLkZsb2F0KVxyXG4gICAgcHJvdGVjdGVkIHNjcm9sbFNwZWVkTWF4OiBudW1iZXIgPSAxMFxyXG5cclxuICAgIC8vLyBpdGVtIOe8k+WtmOaxoFxyXG4gICAgcHJvdGVjdGVkIF9pdGVtUG9vbDogeyBba2V5OnN0cmluZ106IExvb3BMaXN0SXRlbVtdfSA9IG51bGxcclxuICAgIHByb3RlY3RlZCBfdGVtcGxhdGVzOiB7W2tleTpzdHJpbmddOiBMb29wTGlzdEl0ZW19ID0ge31cclxuICAgIHByb3RlY3RlZCBfdGVtcGxhdGU6IHN0cmluZyA9IG51bGwgLy8vIOm7mOiupOS9v+eUqOeahHByZWZhYlxyXG4gICAgcHJvdGVjdGVkIF9pdGVtQ3JlYXRvcjogKCB2aWV3OiBMb29wTGlzdCwgaWR4OiBudW1iZXIpPT5Mb29wTGlzdEl0ZW0gPSBudWxsXHJcbiAgICBwcm90ZWN0ZWQgX3RvdGFsY291bnQ6IG51bWJlciA9IDBcclxuICAgIC8vLyBjdXJyZW50IGRpc3BsYXkgaXRlbVxyXG4gICAgcHJvdGVjdGVkIF9pdGVtczogTG9vcExpc3RJdGVtW10gPSBbXVxyXG4gICAgLy8vIG1heCBwYWRkaW5nIOWMuuWIhuWbnuaUtui+ueeVjOWSjOWIm+W7uui+ueeVjCDpgb/lhY1wYWRkaW5nIOmAoOaIkOeahOmHjeWkjeWIm+W7uuWSjOWbnuaUtlxyXG4gICAgcHJvdGVjdGVkIF9tYXhQYWRkaW5nOiBudW1iZXIgPSAwXHJcblxyXG4gICAgLy8vIOe8k+WtmOi+ueeVjCByZWN5Y2xlICYgY3JlYXRlIGl0ZW0gYm91bmRhcnlcclxuICAgIHByb3RlY3RlZCBsZWZ0Qm91bmRhcnk6IG51bWJlciA9IDBcclxuICAgIHByb3RlY3RlZCByaWdodEJvdW5kYXJ5OiBudW1iZXIgPSAwXHJcbiAgICBwcm90ZWN0ZWQgdG9wQm91bmRhcnk6IG51bWJlciA9IDBcclxuICAgIHByb3RlY3RlZCBib3R0b21Cb3VuZGFyeTogbnVtYmVyID0gMFxyXG4gICAgLy8vIOS4iuS4i+W3puWPs+i+ueeVjFxyXG4gICAgcHJvdGVjdGVkIF9sZWZ0Qm91bmRhcnk6IG51bWJlciAgID0gMFxyXG4gICAgcHJvdGVjdGVkIF9ib3R0b21Cb3VuZGFyeTogbnVtYmVyID0gMCBcclxuICAgIHByb3RlY3RlZCBfcmlnaHRCb3VuZGFyeTogbnVtYmVyICA9IDBcclxuICAgIHByb3RlY3RlZCBfdG9wQm91bmRhcnk6IG51bWJlciAgICA9IDBcclxuICAgIC8vLyDmoIforrBpdGVtIHNpemUg5piv5ZCm5Y+Y5YyWXHJcbiAgICBwcm90ZWN0ZWQgX2l0ZW1TaXplRGlydHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgLy8vIOagh+iusGl0ZW0g5piv5ZCm6ZyA6KaB5pu05paw77yI5Yib5bu65oiW5Zue5pS277yJXHJcbiAgICBwcm90ZWN0ZWQgX2l0ZW1EaXJ0eTogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICAvLy8g5ruR5Yqo56e75Yqo5pe255So5Yiw55qE5o6n5Yi25Y+Y6YePIOWxleekuml0ZW0g5YiwaWR4XHJcbiAgICBwcm90ZWN0ZWQgYW5pbWVJZHg6IG51bWJlciA9IDBcclxuICAgIHByb3RlY3RlZCBiQW5pbWVNb3ZlaW5nOiBib29sZWFuID0gZmFsc2VcclxuXHJcbiAgICAvLy8g6KeG5Y+jXHJcbiAgICBAcHJvcGVydHkoIGNjLlNjcm9sbFZpZXcpXHJcbiAgICBwcm90ZWN0ZWQgc2Nyb2xsVmlldzogY2MuU2Nyb2xsVmlldyA9IG51bGxcclxuICAgIGdldCBjb250ZW50KCk6IGNjLk5vZGUgeyByZXR1cm4gdGhpcy5zY3JvbGxWaWV3LmNvbnRlbnR9XHJcbiAgICBnZXQgdmlld1BvcnQoKTpjYy5Ob2RlIHsgcmV0dXJuIHRoaXMuY29udGVudC5wYXJlbnR9XHJcblxyXG4gICAgb25Mb2FkKCl7XHJcbiAgICAgICAgLy8vIOWPquWFgeiuuOS4gOS4quaWueWQkVxyXG4gICAgICAgIGlmKCB0aGlzLnNjcm9sbFZpZXcgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcgPSB0aGlzLmdldENvbXBvbmVudCggY2MuU2Nyb2xsVmlldylcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOmHjee9rnNjcm9sbHZpZXcg5rua5Yqo5bGe5oCnXHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Lmhvcml6b250YWwgPSB0aGlzLm1vdmVtZW50ID09IE1vdmVtZW50Lkhvcml6b250YWxcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcudmVydGljYWwgPSB0aGlzLm1vdmVtZW50ID09IE1vdmVtZW50LlZlcnRpY2FsXHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3LmVsYXN0aWMgPSB0cnVlIC8vLyDlhYHorrjotoXlh7rovrnnlYxcclxuICAgICAgICAvLy8g6YeN5a6a5ZCRc2Nyb2xsdmlldyDlh73mlbBcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkuYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5fY2FsY3VsYXRlQm91bmRhcnkgPSB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeS5iaW5kKHRoaXMpXHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Ll9jbGFtcERlbHRhID0gdGhpcy5fY2xhbXBEZWx0YS5iaW5kKHRoaXMpXHJcbiAgICAgICAgaWYoIHRoaXMuY29udGVudCkge1xyXG4gICAgICAgICAgICAvLy8gaW5pdGlhbGl6ZSBjb250ZW50IHZpZXdcclxuICAgICAgICAgICAgbGV0IGFuY2ggPSB0aGlzLnNjcm9sbFZpZXcuaG9yaXpvbnRhbD8gY2MudjIoIDAsIDAuNSk6IGNjLnYyKCAwLjUsIDEpXHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRBbmNob3JQb2ludCggYW5jaCkgXHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRQb3NpdGlvbiggY2MuVmVjMi5aRVJPKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gaW5pdGlhbGl6ZSBkYXRhXHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkoKVxyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Lm5vZGUub24oIFwic2Nyb2xsaW5nXCIsIHRoaXMub25TY3JvbGxpbmcsIHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCl7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Lm5vZGUub2ZmKCBcInNjcm9sbGluZ1wiLCB0aGlzLm9uU2Nyb2xsaW5nLCB0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyBpbml0aWFsaXplIHRvdGFsIGNvdW50LCBpdGVtIGNyZWF0b3JcclxuICAgIGluaXRpYWxpemUoY3JlYXRvcjooIHZpZXc6IExvb3BMaXN0LCBpZHg6IG51bWJlcik9Pkxvb3BMaXN0SXRlbSwgY291bnQ6IG51bWJlciA9IDApe1xyXG4gICAgICAgIHRoaXMuX3RvdGFsY291bnQgPSBjb3VudCB8fCAwXHJcbiAgICAgICAgdGhpcy5faXRlbUNyZWF0b3IgPSBjcmVhdG9yXHJcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZVBvb2woKVxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCkgXHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOiuvue9ruW9k+WJjWl0ZW0gY291bnQg5aaC5p6c5LiN5piv5by65Yi2UmVzZXRcclxuICAgIC8vLyDpgqPkuYjlpKfkuo7nrYnkuo7lvZPliY1pdGVtY291dCB8fCDmnIDlkI7kuIDpoblpdGVt5LiN5pivIOW9k+WJjWl0ZW0g6Ieq5Yqo5L2/55So5Yi35paw5pa55byP5LiN5Lya5L+u5pS55b2T5YmNaXRlbSDnmoTmmL7npLrkvY3nva5cclxuICAgIHNldEl0ZW1Db3VudCggY291bnQ6IG51bWJlciwgYlJlc2V0OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgb2xkY291bnQgPSB0aGlzLl90b3RhbGNvdW50XHJcbiAgICAgICAgdGhpcy5fdG90YWxjb3VudCA9IGNvdW50XHJcbiAgICAgICAgaWYoIGJSZXNldCkgeyBcclxuICAgICAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0VmlldygpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8vIOWmguaenOaWsOeahGl0ZW0gY291bnQg5aSn5LqOIG9sZEl0ZW1jb3VudOmCo+S5iOWkp+S6juetieS6juW9k+WJjWl0ZW1jb3V0XHJcbiAgICAgICAgICAgIGxldCBsYXN0SXRlbSA9IHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDA/IHRoaXMuX2l0ZW1zWyB0aGlzLl9pdGVtcy5sZW5ndGgtMV06IG51bGxcclxuICAgICAgICAgICAgaWYoIGNvdW50ID49IG9sZGNvdW50IHx8IChsYXN0SXRlbSAhPSBudWxsICYmIGxhc3RJdGVtLml0ZW1JZHggPCAoY291bnQgLTEpKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoSXRlbXMoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SXRlbSggY291bnQgLSAxKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgIFxyXG4gICAgLy8vIOWIt+aWsOW9k+WJjeaJgOaciWl0ZW1cclxuICAgIHJlZnJlc2hJdGVtcygpIHtcclxuICAgICAgICBpZiggdGhpcy5fdG90YWxjb3VudCA+IDAgJiYgdGhpcy5faXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgZnJpc3RJdGVtICAgPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBsZXQgcG9zICAgICAgICAgPSBmcmlzdEl0ZW0ubm9kZS5wb3NpdGlvblxyXG4gICAgICAgICAgICBsZXQgaXRlbUlkeCAgICAgPSBmcmlzdEl0ZW0uaXRlbUlkeFxyXG4gICAgICAgICAgICAvLy8gY3JlYXRlIHRvcCBpdGVtXHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcygpXHJcbiAgICAgICAgICAgIGxldCBhcmcgPSB0aGlzLm1vdmVtZW50ID09IE1vdmVtZW50Lkhvcml6b250YWw/IHBvcy54OiBwb3MueVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0VmlldyggaXRlbUlkeCwgYXJnKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzaG93SXRlbSggaWR4OiBudW1iZXIsIGJBbmltZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgLy8g6ZmQ5a6a5YiwIDAgLSDvvIh0b3RhbGNvdW50IC0x77yJ6IyD5Zu05YaFXHJcbiAgICAgICAgaWR4ID0gTWF0aC5taW4oIHRoaXMuX3RvdGFsY291bnQgLSAxLCBNYXRoLm1heCgwLCBpZHgpKSBcclxuICAgICAgICBpZiggYkFuaW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVmlldy5zdG9wQXV0b1Njcm9sbCgpXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWVJZHggPSBpZHg7XHJcbiAgICAgICAgICAgIHRoaXMuYkFuaW1lTW92ZWluZyA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8vIOWbnuaUtuaJgOaciWl0ZW1zIOS7juaWsOWIm+W7unRvcCBpdGVtXHJcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd0l0ZW1Ib3IoIGlkeClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5WZXJ0aWNhbDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG93SXRlbVZlciggaWR4KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOiOt+WPluS4gOS4qml0ZW0gXHJcbiAgICBnZXROZXdJdGVtKCBrZXk6IHN0cmluZyA9IG51bGwpOiBMb29wTGlzdEl0ZW0ge1xyXG4gICAgICAgIGtleSA9IGtleSB8fCB0aGlzLl90ZW1wbGF0ZVxyXG4gICAgICAgIGxldCBwb29sID0gdGhpcy5faXRlbVBvb2xba2V5XVxyXG4gICAgICAgIGxldCBpbnN0YW5jZTogTG9vcExpc3RJdGVtID0gKHBvb2wgJiYgcG9vbC5sZW5ndGggPiAwKT8gcG9vbC5wb3AoKTogbnVsbFxyXG4gICAgICAgIGlmICggaW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgcHJlZmFiID0gdGhpcy5fdGVtcGxhdGVzW2tleV1cclxuICAgICAgICAgICAgaWYoIHByZWZhYiAhPSBudWxsKSB7IFxyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBjYy5pbnN0YW50aWF0ZSggcHJlZmFiLm5vZGUpIFxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBub2RlLmdldENvbXBvbmVudCggTG9vcExpc3RJdGVtKVxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuaXRlbUtleSA9IGtleVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgbm90IGZvdW5kIHRlbXBsYXRlOiAke2tleX1gKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIGl0ZW1TaXplQ2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLl9pdGVtU2l6ZURpcnR5ID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIG9uU2Nyb2xsaW5nKCkge1xyXG4gICAgICAgIHRoaXMuX2l0ZW1EaXJ0eSA9IHRydWVcclxuICAgICAgICB0aGlzLmJBbmltZU1vdmVpbmcgPSBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSggZHQ6IG51bWJlcikge1xyXG4gICAgICAgIC8vLyDliqjnlLvnp7vliqhcclxuICAgICAgICB0aGlzLmJBbmltZU1vdmVpbmcgPSB0aGlzLl9zY3JvbGxpbmc/IGZhbHNlOiB0aGlzLmJBbmltZU1vdmVpbmdcclxuICAgICAgICBzd2l0Y2goIHRoaXMubW92ZW1lbnQpe1xyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtU2l6ZURpcnR5ICYmIHRoaXMuX3VwZGF0ZUhvcml6b250YWxJdGVtcygpIC8vLyBjaGVjayBpdGVtIHNpemUgZGlydHlcclxuICAgICAgICAgICAgICAgIHRoaXMuYkFuaW1lTW92ZWluZyAmJiB0aGlzLl9zY3JvbGxUb0l0ZW1Ib3IoIHRoaXMuYW5pbWVJZHgpIC8vLyBjaGVjayBhdXRvIG1vdmVpbmdcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuVmVydGljYWw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtU2l6ZURpcnR5ICYmIHRoaXMuX3VwZGF0ZVZlcnRpY2FsSXRlbXMoKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nICYmIHRoaXMuX3Njcm9sbFRvSXRlbVZlciggdGhpcy5hbmltZUlkeClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2l0ZW1TaXplRGlydHkgPSBmYWxzZVxyXG4gICAgICAgIC8vLyBjcmVhdGUgfHwgcmVjeWNsZSBpdGVtXHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1EaXJ0eSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSBmYWxzZVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0VmlldygpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaW5pdGlhbGl6ZVBvb2woKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1Qb29sID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbVBvb2wgPSB7fVxyXG4gICAgICAgICAgICBsZXQgcHJlZmFicyA9IHRoaXMuY29udGVudC5nZXRDb21wb25lbnRzSW5DaGlsZHJlbiggTG9vcExpc3RJdGVtKVxyXG4gICAgICAgICAgICBwcmVmYWJzLmZvckVhY2goIGl0ZW09PntcclxuICAgICAgICAgICAgICAgIC8vLyBzYXZlIHRlbXBsYXRlcyBcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLml0ZW1LZXkgPSBpdGVtLm5vZGUubmFtZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgICAgICAgICAgPSB0aGlzLl90ZW1wbGF0ZSA9PSBudWxsPyBrZXk6IHRoaXMuX3RlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZXNba2V5XSAgICA9IGl0ZW1cclxuICAgICAgICAgICAgICAgIHRoaXMuX21heFBhZGRpbmcgICAgICAgID0gTWF0aC5tYXgoIHRoaXMuX21heFBhZGRpbmcsIGl0ZW0ucGFkZGluZysyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggaXRlbSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldENvbnRlbnRQb3NpdGlvbiggcG9zOiBjYy5WZWMyKXtcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuc3RvcEF1dG9TY3JvbGwoKVxyXG4gICAgICAgIGlmKCB0aGlzLnNjcm9sbFZpZXcuY29udGVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuY29udGVudC5wb3NpdGlvbiA9IHBvc1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Nob3dJdGVtVmVyKCBpZHg6IG51bWJlcikge1xyXG4gICAgICAgIC8vLyDliKTmlq3pnIDopoHnjrDlrp7nmoRpdGVt5ZKM5pyA5ZCO5LiA5Liq6YO95Zyo56qX5Y+j5YaF5bCx5LiN55So5omn6KGM5LqGXHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGZyaXN0ID0gdGhpcy5fZ2V0SXRlbUF0KCBpZHgpXHJcbiAgICAgICAgICAgIGxldCBsYXN0ID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoIC0xXVxyXG4gICAgICAgICAgICBpZiggZnJpc3QhPSBudWxsICYmIGxhc3QuaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQtMSkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtVG9wKCBmcmlzdCkgPD0gdGhpcy5fdG9wQm91bmRhcnkgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbUJvdHRvbSggbGFzdCkgPj0gdGhpcy5fYm90dG9tQm91bmRhcnkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOWbnuaUtuW9k+WJjeaJgOaciWl0ZW0gJiByZXNldCBjb250ZW50IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldyggaWR4KSl7XHJcbiAgICAgICAgICAgIC8vLyDliKTmlq3mnIDlkI7kuIDmnaHmmK/lkKblnKjnqpflj6PlhoXpg6jpnIDopoHpnaDnqpflj6PlupXpg6hcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1sgdGhpcy5faXRlbXMubGVuZ3RoIC0xXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKXtcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b20gPSB0aGlzLl9nZXRJdGVtQm90dG9tKCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYoIGJvdHRvbSA+IHRoaXMuX2JvdHRvbUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIC8vLyDnp7vliqjnqpflj6PlkI7pnIDopoHph43mlrDliqDovb3pobbpg6hpdGVtICZcclxuICAgICAgICAgICAgICAgICAgICAvLy8g5Yik5patIHRvcGl0ZW0g5piv5ZCm5Zyo6aG26YOo6L6555WM6YeM6Z2i5Y675LqGXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggdGl0ZW0uaXRlbUlkeCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvcCA9IHRoaXMuX2dldEl0ZW1Ub3AoIHRpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRvcCA8IHRoaXMuX3RvcEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnkgPSB0aGlzLmNvbnRlbnQueSArICh0aGlzLl90b3BCb3VuZGFyeSAtIHRvcClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLy8g5qCH6K6waXRlbSDpnIDopoHph43mlrDliJvlu7rlm57mlLZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zaG93SXRlbUhvciggaWR4OiBudW1iZXIpe1xyXG4gICAgICAgIC8vLyDliKTmlq3pnIDopoHmmL7npLrnmoRpdGVt5ZKM5pyA5ZCO5LiA5Liq6YO95Zyo56qX5Y+j5YaF5bCx5LiN55So5omn6KGM5LqGXHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGZyaXN0ID0gdGhpcy5fZ2V0SXRlbUF0KCBpZHgpXHJcbiAgICAgICAgICAgIGxldCBsYXN0ID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoIC0xXVxyXG4gICAgICAgICAgICBpZiggZnJpc3QhPSBudWxsICYmIGxhc3QuaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQtMSkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtTGVmdCggZnJpc3QpID49IHRoaXMuX2xlZnRCb3VuZGFyeSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtUmlnaHQoIGxhc3QpIDw9IHRoaXMuX3JpZ2h0Qm91bmRhcnkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOWbnuaUtuW9k+WJjeaJgOaciWl0ZW0gJiByZXNldCBjb250ZW50IHBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldyggaWR4KSkge1xyXG4gICAgICAgICAgICAvLy8g5Yik5pat5pyA5ZCO5LiA5p2h5piv5ZCm5Zyo56qX5Y+j5YaF6YOo6ZyA6KaB6Z2g56qX5Y+j5Y+z6L65XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbIHRoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLl9nZXRJdGVtUmlnaHQoIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpZiggcmlnaHQgPCB0aGlzLl9yaWdodEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnggPSB0aGlzLl9yaWdodEJvdW5kYXJ5IC0gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICAvLy8g5Yik5patIGxlZnRpdGVtIOaYr+WQpuWcqOW3pui+ueeVjOi+ueeVjOmHjOmdouWOu+S6hlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldygpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRpdGVtLml0ZW1JZHggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gdGhpcy5fZ2V0SXRlbUxlZnQoIHRpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGxlZnQgPiB0aGlzLl9sZWZ0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQueCA9IHRoaXMuY29udGVudC54IC0gKGxlZnQgLSB0aGlzLl9sZWZ0Qm91bmRhcnkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8vIOagh+iusGl0ZW0g6ZyA6KaB6YeN5paw5Yib5bu65Zue5pS2XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfc2Nyb2xsVG9JdGVtSG9yKCBpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fZ2V0SXRlbUF0KCBpZHgpXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDBcclxuICAgICAgICBpZiggaXRlbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX2l0ZW1zWzBdLml0ZW1JZHggPiBpZHg/IHRoaXMuc2Nyb2xsU3BlZWRNYXg6IC10aGlzLnNjcm9sbFNwZWVkTWF4XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5fbGVmdEJvdW5kYXJ5IC0gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmKCBpZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0gMSkpIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgLSB0aGlzLl9nZXRJdGVtUmlnaHQoIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXQgPj0gMD8gMDogb2Zmc2V0XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFzdCA9IHRoaXMuX2l0ZW1zWyB0aGlzLl9pdGVtcy5sZW5ndGggLSAxXVxyXG4gICAgICAgICAgICAgICAgaWYoIGxhc3QuaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSAmJiBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtUmlnaHQoIGxhc3QpIDw9IHRoaXMuX3JpZ2h0Qm91bmRhcnkpICB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gMFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDliKTmlq3mmK/lkKbkuLowXHJcbiAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gTWF0aC5hYnMoIG9mZnNldCkgPiBFUFNJTE9OXHJcbiAgICAgICAgaWYoIG9mZnNldCA+IHRoaXMuc2Nyb2xsU3BlZWRNYXggfHwgb2Zmc2V0IDwgLXRoaXMuc2Nyb2xsU3BlZWRNYXgpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5taW4oIHRoaXMuc2Nyb2xsU3BlZWRNYXgsIE1hdGgubWF4KCAtdGhpcy5zY3JvbGxTcGVlZE1heCwgb2Zmc2V0KSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLy8g5YGa5Liq57q/5oCn5o+S5YC85pu05bmz5ruRXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBvZmZzZXQgIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX21vdmVDb250ZW50KCBjYy52Miggb2Zmc2V0LCAwKSwgdHJ1ZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuc3RvcEF1dG9TY3JvbGwoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Njcm9sbFRvSXRlbVZlciggaWR4OiBudW1iZXIpe1xyXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fZ2V0SXRlbUF0KCBpZHgpXHJcbiAgICAgICAgbGV0IG9mZnNldCA9IDBcclxuICAgICAgICBpZiggaXRlbSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9mZnNldCA9IHRoaXMuX2l0ZW1zWzBdLml0ZW1JZHggPiBpZHg/IC10aGlzLnNjcm9sbFNwZWVkTWF4OiB0aGlzLnNjcm9sbFNwZWVkTWF4XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gdGhpcy5fdG9wQm91bmRhcnkgLSB0aGlzLl9nZXRJdGVtVG9wKCBpdGVtKVxyXG4gICAgICAgICAgICBpZiggaWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIHRoaXMuX2dldEl0ZW1Cb3R0b20oIGl0ZW0pIFxyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IDw9IDA/IDA6IG9mZnNldFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhc3QgPSB0aGlzLl9pdGVtc1sgdGhpcy5faXRlbXMubGVuZ3RoIC0gMV1cclxuICAgICAgICAgICAgICAgIGlmKCBsYXN0Lml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0gMSkgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbUJvdHRvbSggbGFzdCkgPD0gdGhpcy5fcmlnaHRCb3VuZGFyeSkgIHtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSAwXHJcbiAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDliKTmlq3mmK/lkKbkuLowXHJcbiAgICAgICAgdGhpcy5iQW5pbWVNb3ZlaW5nID0gTWF0aC5hYnMoIG9mZnNldCkgPiBFUFNJTE9OXHJcbiAgICAgICAgaWYoIG9mZnNldCA+IHRoaXMuc2Nyb2xsU3BlZWRNYXggfHwgb2Zmc2V0IDwgLXRoaXMuc2Nyb2xsU3BlZWRNYXgpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gTWF0aC5taW4oIHRoaXMuc2Nyb2xsU3BlZWRNYXgsIE1hdGgubWF4KCAtdGhpcy5zY3JvbGxTcGVlZE1heCwgb2Zmc2V0KSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLy8g5YGa5Liq57q/5oCn5o+S5YC85pu05bmz5ruRXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBvZmZzZXQgIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX21vdmVDb250ZW50KCBjYy52MiggMCwgb2Zmc2V0KSwgdHJ1ZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFZpZXcuc3RvcEF1dG9TY3JvbGwoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3JlY3ljbGUoaXRlbTogTG9vcExpc3RJdGVtKSB7XHJcbiAgICAgICAgbGV0IHBvb2wgPSB0aGlzLl9pdGVtUG9vbFtpdGVtLml0ZW1LZXldXHJcbiAgICAgICAgaWYoIHBvb2wgPT0gbnVsbCkgeyBwb29sID0gdGhpcy5faXRlbVBvb2xbaXRlbS5pdGVtS2V5XSA9IFtdIH1cclxuICAgICAgICBpdGVtLm5vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICBpdGVtLmxvb3BsaXN0ID0gbnVsbFxyXG4gICAgICAgIHBvb2wucHVzaCggaXRlbSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIF9yZWN5Y2xlQWxsSXRlbXMoIHJlc2V0OmJvb2xlYW4gPSBmYWxzZSl7XHJcbiAgICAgICAgdGhpcy5faXRlbXMuZm9yRWFjaCggaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIGl0ZW0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5faXRlbXMgPSBbXVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5zdG9wQXV0b1Njcm9sbCgpXHJcbiAgICAgICAgcmVzZXQgJiYgdGhpcy5zZXRDb250ZW50UG9zaXRpb24oIGNjLlZlYzIuWkVSTylcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZU5ld0l0ZW0oIGlkeDogbnVtYmVyKTogTG9vcExpc3RJdGVtIHtcclxuICAgICAgICBpZiggaWR4IDwgMCB8fCBpZHggPj0gdGhpcy5fdG90YWxjb3VudCkgcmV0dXJuIG51bGwgXHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtQ3JlYXRvcj8gdGhpcy5faXRlbUNyZWF0b3IoIHRoaXMsIGlkeCkgOiBudWxsXHJcbiAgICAgICAgaWYoIGl0ZW0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpdGVtLm5vZGUucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87IGl0ZW0uaXRlbUlkeCA9IGlkeDsgXHJcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpdGVtLmxvb3BsaXN0ID0gdGhpczsgXHJcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5wYXJlbnQgPSB0aGlzLmNvbnRlbnRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldEl0ZW1BdCggaWR4OiBudW1iZXIpOiBMb29wTGlzdEl0ZW17XHJcbiAgICAgICAgZm9yKCBsZXQgaT0wOyBpPHRoaXMuX2l0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbaV0gXHJcbiAgICAgICAgICAgIGlmKCBpdGVtLml0ZW1JZHggPT0gaWR4KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRJdGVtVG9wKCBpdGVtOiBMb29wTGlzdEl0ZW0pOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBpdGVtLm5vZGUueSArIHRoaXMuY29udGVudC55XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRJdGVtQm90dG9tKCBpdGVtOiBMb29wTGlzdEl0ZW0pOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpdGVtdG9wID0gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSlcclxuICAgICAgICByZXR1cm4gaXRlbXRvcCAtIGl0ZW0ubm9kZS5oZWlnaHQgXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRJdGVtTGVmdCggaXRlbTogTG9vcExpc3RJdGVtKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gaXRlbS5ub2RlLnggKyB0aGlzLmNvbnRlbnQueCAvLyArIGl0ZW0ub2Zmc2V0XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRJdGVtUmlnaHQoIGl0ZW06IExvb3BMaXN0SXRlbSk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IGl0ZW1MZWZ0ID0gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pXHJcbiAgICAgICAgcmV0dXJuIGl0ZW1MZWZ0ICsgaXRlbS5ub2RlLndpZHRoXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVMaXN0VmlldyggaWR4OiBudW1iZXIgPSAwLCBwb3M6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAvLy8gY3VyIGNvdW50XHJcbiAgICAgICAgbGV0IGNoZWNrY291bnQgPSAwXHJcbiAgICAgICAgbGV0IGNyZWF0ZSA9IHRoaXMubW92ZW1lbnQgPT09IE1vdmVtZW50Lkhvcml6b250YWw/IHRoaXMuX3VwZGF0ZUhvcml6b250YWw6IHRoaXMuX3VwZGF0ZVZlcnRpY2FsXHJcbiAgICAgICAgd2hpbGUoIGNyZWF0ZS5jYWxsKCB0aGlzLCBpZHgsIHBvcykpIHtcclxuICAgICAgICAgICAgaWYoICsrY2hlY2tjb3VudCA+PSB0aGlzLmZyYW1lQ3JlYXRlTWF4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NyZWF0ZVRvcEl0ZW0oIGlkeDogbnVtYmVyLCB5OiBudW1iZXIgPSBudWxsKTogTG9vcExpc3RJdGVtIHtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIGlkeClcclxuICAgICAgICBpZiggaXRlbSkge1xyXG4gICAgICAgICAgICBpZiggeSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IC10aGlzLl9nZXRJdGVtVG9wKCBpdGVtKSArIHRoaXMuX3RvcEJvdW5kYXJ5IC0gaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0geVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOS7juaWsOaOkuW6j2l0ZW1zXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVZlcnRpY2FsSXRlbXMoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgbGV0IHBpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgZm9yKCBsZXQgaWR4PTE7IGlkeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgaWR4Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1tpZHhdXHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHBpdGVtLm5vZGUueSAtIHBpdGVtLm5vZGUuaGVpZ2h0IC0gaXRlbS5wYWRkaW5nXHJcbiAgICAgICAgICAgICAgICBwaXRlbSA9IGl0ZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVZlcnRpY2FsKCBpZHg6IG51bWJlciwgcG9zOiBudW1iZXIpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGN1ckNvdW50ID0gdGhpcy5faXRlbXMubGVuZ3RoXHJcbiAgICAgICAgLy8vIHJlY3ljbGUgYWxsIGl0ZW1zXHJcbiAgICAgICAgaWYoIHRoaXMuX3RvdGFsY291bnQgPT0gMCApIHtcclxuICAgICAgICAgICAgY3VyQ291bnQgPiAwICYmIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBmaWxsIHVwICYgZmlsbCBkb3duXHJcbiAgICAgICAgaWYoIGN1ckNvdW50ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlVG9wSXRlbSggaWR4LCBwb3MpXHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9IG51bGxcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIHJlY3ljbGUgdG9wIGl0ZW0g5Zue5pS26aG26YOo5pWw5o2uIOWmguaenOacgOW6leS4i+eahGl0ZW0g5piv5pyA5ZCO5LiA5p2h6YKj5LmI5LiN5Zue5pS25LiK6Z2i55qEaXRlbVxyXG4gICAgICAgIGxldCB0b3BpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgYm90dG9taXRlbSA9IHRoaXMuX2l0ZW1zWyBjdXJDb3VudC0xXVxyXG4gICAgICAgIGxldCBib3R0b21fYm90dG9tID0gdGhpcy5fZ2V0SXRlbUJvdHRvbSggYm90dG9taXRlbSlcclxuICAgICAgICBpZiggY3VyQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHRvcCBpdGVtXHJcbiAgICAgICAgICAgIGxldCBjYW5SZWN5Y2xlVG9wID0gKGJvdHRvbWl0ZW0uaXRlbUlkeCAhPT0gdGhpcy5fdG90YWxjb3VudC0xIHx8IGJvdHRvbV9ib3R0b20gPCB0aGlzLl9ib3R0b21Cb3VuZGFyeSlcclxuICAgICAgICAgICAgaWYoIGNhblJlY3ljbGVUb3AgJiYgdGhpcy5fZ2V0SXRlbUJvdHRvbSggdG9waXRlbSkgPiAodGhpcy50b3BCb3VuZGFyeSArIHRoaXMuX21heFBhZGRpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCB0b3BpdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgLy8vIHJlY3ljbGUgYm90dG9tIGl0ZW1cclxuICAgICAgICAgICAgaWYoIHRvcGl0ZW0uaXRlbUlkeCA+IDAgJiYgdGhpcy5fZ2V0SXRlbVRvcCggYm90dG9taXRlbSkgPCAodGhpcy5ib3R0b21Cb3VuZGFyeSAtIHRoaXMuX21heFBhZGRpbmcpKSB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCBjdXJDb3VudC0xLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggYm90dG9taXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSB0b3AgaXRlbVxyXG4gICAgICAgIGlmKCB0aGlzLl9nZXRJdGVtVG9wKCB0b3BpdGVtKSA8IHRoaXMudG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCB0b3BpdGVtLml0ZW1JZHggLSAxKVxyXG4gICAgICAgICAgICBpZiggaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSB0b3BpdGVtLm5vZGUueSArIGl0ZW0ucGFkZGluZyArIGl0ZW0ubm9kZS5oZWlnaHRcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbVxyXG4gICAgICAgIGlmKCBib3R0b21fYm90dG9tID4gdGhpcy5ib3R0b21Cb3VuZGFyeSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIGJvdHRvbWl0ZW0uaXRlbUlkeCArIDEpXHJcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IGJvdHRvbWl0ZW0ubm9kZS55IC0gYm90dG9taXRlbS5ub2RlLmhlaWdodCAtIGJvdHRvbWl0ZW0ucGFkZGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVMZWZ0SXRlbSggaWR4OiBudW1iZXIsIHg6bnVtYmVyID0gbnVsbCkgOiBMb29wTGlzdEl0ZW17XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCBpZHgpXHJcbiAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYoIHggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSAtdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pICsgdGhpcy5fbGVmdEJvdW5kYXJ5ICsgaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0geFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVIb3Jpem9udGFsSXRlbXMoKXtcclxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBsZXQgcHJlaXRlbSA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgICAgIGZvciggbGV0IGlkeD0xOyBpZHggPCB0aGlzLl9pdGVtcy5sZW5ndGg7IGlkeCsrKXtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbaWR4XVxyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSBwcmVpdGVtLm5vZGUueCArIHByZWl0ZW0ubm9kZS5oZWlnaHQgKyBpdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHByZWl0ZW0gPSBpdGVtXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVIb3Jpem9udGFsKCBpZHg6IG51bWJlciwgcG9zOiBudW1iZXIpOiBib29sZWFue1xyXG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxyXG4gICAgICAgIC8vLyByZWN5Y2xlIGFsbCBpdGVtc1xyXG4gICAgICAgIGlmKCB0aGlzLl90b3RhbGNvdW50ID09IDApIHtcclxuICAgICAgICAgICAgY3VyQ291bnQgPiAwICYmIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBmaWxsIHVwICYgZmlsbCBkb3duXHJcbiAgICAgICAgaWYoIGN1ckNvdW50ID09IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVMZWZ0SXRlbSggaWR4LCBwb3MpXHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtICE9IG51bGw/IHRydWU6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBmaWxsIGxlZnQgJiBmaWxsIHJpZ2h0XHJcbiAgICAgICAgbGV0IGxlZnRJdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICBsZXQgcmlnaHRJdGVtID0gdGhpcy5faXRlbXNbIGN1ckNvdW50LTFdXHJcbiAgICAgICAgbGV0IHJpZ2h0X3JpZ2h0ID0gdGhpcy5fZ2V0SXRlbVJpZ2h0KCByaWdodEl0ZW0pXHJcbiAgICAgICAgaWYoIGN1ckNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAvLy8gcmVjeWNsZSBsZWZ0IGl0ZW1cclxuICAgICAgICAgICAgbGV0IGNhblJlY3ljbGVMZWZ0ID0gKHJpZ2h0SXRlbS5pdGVtSWR4ICE9PSAodGhpcy5fdG90YWxjb3VudCAtIDEpIHx8IHJpZ2h0X3JpZ2h0ID4gdGhpcy5yaWdodEJvdW5kYXJ5KVxyXG4gICAgICAgICAgICBpZiggY2FuUmVjeWNsZUxlZnQgJiYgdGhpcy5fZ2V0SXRlbVJpZ2h0KCBsZWZ0SXRlbSkgPCAodGhpcy5sZWZ0Qm91bmRhcnkgLSB0aGlzLl9tYXhQYWRkaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggbGVmdEl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHJpZ2h0IGl0ZW1cclxuICAgICAgICAgICAgaWYoIGxlZnRJdGVtLml0ZW1JZHggPiAwICYmIHRoaXMuX2dldEl0ZW1MZWZ0KHJpZ2h0SXRlbSkgPiAodGhpcy5yaWdodEJvdW5kYXJ5ICsgdGhpcy5fbWF4UGFkZGluZykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggY3VyQ291bnQtMSwgMSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIHJpZ2h0SXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBsZWZ0IGl0ZW1cclxuICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbUxlZnQoIGxlZnRJdGVtKSA+IHRoaXMubGVmdEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggbGVmdEl0ZW0uaXRlbUlkeCAtIDEpXHJcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IGxlZnRJdGVtLm5vZGUueCAtIGl0ZW0ubm9kZS53aWR0aCAtIGl0ZW0ucGFkZGluZyBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbVxyXG4gICAgICAgIGlmKCByaWdodF9yaWdodCA8IHRoaXMucmlnaHRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIHJpZ2h0SXRlbS5pdGVtSWR4ICsgMSlcclxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gcmlnaHRJdGVtLm5vZGUueCArIHJpZ2h0SXRlbS5ub2RlLndpZHRoICsgcmlnaHRJdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDorqHnrpfovrnnlYwg5LiL6Z2i55qE5Ye95pWw6YO95piv6YeN5YaZc2Nyb2xsdmlldyDljp/mnInnmoTlh73mlbBcclxuICAgIF9jYWxjdWxhdGVCb3VuZGFyeSgpe1xyXG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50LnNldENvbnRlbnRTaXplKCBjYy5zaXplKCB0aGlzLnZpZXdQb3J0LndpZHRoLCB0aGlzLnZpZXdQb3J0LmhlaWdodCkpXHJcbiAgICAgICAgICAgIC8vLyB2aWV3IHBvcnRcclxuICAgICAgICAgICAgbGV0IHZpZXdTaXplID0gdGhpcy52aWV3UG9ydC5nZXRDb250ZW50U2l6ZSgpO1xyXG4gICAgICAgICAgICBsZXQgYW5jaG9yWCA9IHZpZXdTaXplLndpZHRoICogdGhpcy52aWV3UG9ydC5hbmNob3JYO1xyXG4gICAgICAgICAgICBsZXQgYW5jaG9yWSA9IHZpZXdTaXplLmhlaWdodCAqIHRoaXMudmlld1BvcnQuYW5jaG9yWTtcclxuICAgICAgICAgICAgLy8vIOiuoeeul+S4iuS4i+W3puWPs+eql+WPo+i+ueeVjFxyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0Qm91bmRhcnkgID0gLWFuY2hvclg7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvdHRvbUJvdW5kYXJ5ID0gLWFuY2hvclk7XHJcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0Qm91bmRhcnkgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgKyB2aWV3U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fdG9wQm91bmRhcnkgICA9IHRoaXMuX2JvdHRvbUJvdW5kYXJ5ICsgdmlld1NpemUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAvLy8g6K6h566X5LiK5LiL5bem5Y+zIOWbnuaUtnzliJvlu7og6L6555WMXHJcbiAgICAgICAgICAgIHRoaXMubGVmdEJvdW5kYXJ5ICAgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSB0aGlzLmNhY2hlQm91bmRhcnlcclxuICAgICAgICAgICAgdGhpcy5yaWdodEJvdW5kYXJ5ICA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgKyB0aGlzLmNhY2hlQm91bmRhcnlcclxuICAgICAgICAgICAgdGhpcy50b3BCb3VuZGFyeSAgICA9IHRoaXMuX3RvcEJvdW5kYXJ5ICsgdGhpcy5jYWNoZUJvdW5kYXJ5XHJcbiAgICAgICAgICAgIHRoaXMuYm90dG9tQm91bmRhcnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIHRoaXMuY2FjaGVCb3VuZGFyeVxyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coIFwiYm91bmRhcnk6XCIsIHRoaXMuX3RvcEJvdW5kYXJ5LCB0aGlzLl9ib3R0b21Cb3VuZGFyeSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOijgeWJquenu+WKqOmHj1xyXG4gICAgX2NsYW1wRGVsdGEgKGRlbHRhOiBjYy5WZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDA/IGRlbHRhOiBjYy5WZWMyLlpFUk87XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOmHjeWGmeivpeWHveaVsOWunueOsOW3pui+ueeVjOWbnuW8uSBcclxuICAgIC8vLyBwYWdlVmlldyDkuZ/lj6/ku6XlnKjov5nph4zlrp7njrAgJiDpgJrov4fliKTmlq3lvZPliY3mraPlnKh2aWV3cG9ydCDnmoTnrKzkuIDkuKppdGVtIOeEtuWQjui/lOWbnuivpWl0ZW0g55qE5LiOTGVmdEJvdW5kZGFyeeeahOWFs+ezu1xyXG4gICAgX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkgKCl7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pIC0gaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdEJvdW5kYXJ5XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOmHjeWGmeivpeWHveaVsOWunueOsOWPs+i+ueeVjOWbnuW8uVxyXG4gICAgX2dldENvbnRlbnRSaWdodEJvdW5kYXJ5ICgpe1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdXHJcbiAgICAgICAgICAgIGlmKCBpdGVtLml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0xKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW1SaWdodCggaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDkuIrovrnnlYzlm57lvLlcclxuICAgIC8vLyBwYWdlVmlldyDkuZ/lj6/ku6XlnKjov5nph4zlrp7njrAgJiDpgJrov4fliKTmlq3lvZPliY3mraPlnKh2aWV3cG9ydCDnmoTnrKzkuIDkuKppdGVtIOeEtuWQjui/lOWbnuivpWl0ZW0g55qE5LiOTGVmdEJvdW5kZGFyeeeahOWFs+ezu1xyXG4gICAgX2dldENvbnRlbnRUb3BCb3VuZGFyeSAoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSkgKyBpdGVtLm9mZnNldFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90b3BCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDkuIvovrnnlYzlm57lvLlcclxuICAgIF9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkgKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdXHJcbiAgICAgICAgICAgIGlmICggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbUJvdHRvbSggaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tQm91bmRhcnlcclxuICAgIH1cclxuXHJcbiAgICAvLyDph43lhpnor6Xlh73mlbDlrp7njrDovrnnlYzlm57lvLlcclxuICAgIF9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSAoYWRkaXRpb246IGNjLlZlYzIpe1xyXG4gICAgICAgIGFkZGl0aW9uID0gYWRkaXRpb24gfHwgY2MudjIoMCwgMCk7XHJcbiAgICAgICAgLy8g5rOo6YeK6L+Z6KGM5Lya6YCg5oiQ5Zue5by5YnVnXHJcbiAgICAgICAgaWYgKGFkZGl0aW9uLmZ1enp5RXF1YWxzKGNjLnYyKDAsIDApLCBFUFNJTE9OKSAmJiAhdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3V0T2ZCb3VuZGFyeUFtb3VudCA9IGNjLnYyKDAsIDApO1xyXG4gICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCkge1xyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6IHtcclxuICAgICAgICAgICAgICAgIC8vLyDmsLTlubPmqKHlvI/lt6blj7PovrnnlYxcclxuICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueSA9IDBcclxuICAgICAgICAgICAgICAgIGxldCBsZWZ0ID0gdGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpICsgYWRkaXRpb24ueFxyXG4gICAgICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5fZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkoKSArIGFkZGl0aW9uLnhcclxuICAgICAgICAgICAgICAgIGlmKCBsZWZ0ID4gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC54ID0gdGhpcy5fbGVmdEJvdW5kYXJ5IC0gbGVmdFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCByaWdodCA8IHRoaXMuX3JpZ2h0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9yaWdodEJvdW5kYXJ5IC0gcmlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBsZWZ0ICsgb3V0T2ZCb3VuZGFyeUFtb3VudC54XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDAgJiYgdGhpcy5faXRlbXNbMF0uaXRlbUlkeCA9PT0gMCAmJiB0ZW1wID49IHRoaXMuX2xlZnRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50LlZlcnRpY2FsOntcclxuICAgICAgICAgICAgICAgIC8vLyAg5Z6C55u05qih5byP5LiK5LiL6L6555WMXHJcbiAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSAwXHJcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gdGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRvcCA8IHRoaXMuX3RvcEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSB0b3BcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYm90dG9tID4gdGhpcy5fYm90dG9tQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSAtIGJvdHRvbTtcclxuICAgICAgICAgICAgICAgICAgICAvLy8g5Yik5pat56ys5LiA5p2haXRlbSDokL3kuIvmnaXmmK/lkKbkvJrotoXov4cgdG9wYm91bmRhcnkg5aaC5p6c6LaF6L+H6KaB6YeN5paw6K6h566XXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSB0b3AgKyBvdXRPZkJvdW5kYXJ5QW1vdW50LnlcclxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLl9pdGVtc1swXS5pdGVtSWR4ID09PSAwICYmIHRlbXAgPD0gdGhpcy5fdG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSB0b3BcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDvvJ/vvJ/vvJ9cclxuICAgICAgICBpZiAoYWRkaXRpb24uZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQgPSBvdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudCA9IHRoaXMuX2NsYW1wRGVsdGEob3V0T2ZCb3VuZGFyeUFtb3VudCk7XHJcbiAgICAgICAgcmV0dXJuIG91dE9mQm91bmRhcnlBbW91bnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLyDojrflj5ZzY3JvbGx2aWV3IOeahOengeacieWxnuaAp1xyXG4gICAgZ2V0IF9vdXRPZkJvdW5kYXJ5QW1vdW50KCk6IGNjLlZlYzJ7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVmlldy5fb3V0T2ZCb3VuZGFyeUFtb3VudFxyXG4gICAgfVxyXG5cclxuICAgIHNldCBfb3V0T2ZCb3VuZGFyeUFtb3VudCh2YWx1ZTogY2MuVmVjMil7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Ll9vdXRPZkJvdW5kYXJ5QW1vdW50ID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSgpOiBib29sZWFue1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFZpZXcuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eVxyXG4gICAgfVxyXG5cclxuICAgIHNldCBfb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KCB2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5ID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX3Njcm9sbGluZygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNjcm9sbFZpZXcuX3Njcm9sbGluZ1xyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=