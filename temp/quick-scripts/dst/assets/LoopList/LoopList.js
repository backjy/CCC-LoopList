
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
        /// 视口
        _this.scrollView = null;
        /// 直接展示item 到idx
        _this.animeIdx = 0;
        _this.bAnimeMoveing = false;
        _this._itemSizeDirty = true;
        _this._itemDirty = false;
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
            // this.animeIdx = idx;
            // this.bAnimeMoveing = true;
            // this.scrollToBottom( 1)
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
        if (this._itemSizeDirty) {
            this._itemSizeDirty = false;
            switch (this.movement) {
                case Movement.Horizontal:
                    this._updateHorizontalItems();
                    break;
                case Movement.Vertical:
                    this._updateVerticalItems();
                    break;
            }
        }
        if (this._itemDirty) {
            this._itemDirty = false;
            this._updateListView();
        }
        /// 动画移动
        // this.bAnimeMoveing = this._scro
        if (this.bAnimeMoveing) {
            switch (this.movement) {
                case Movement.Horizontal:
                    this._animeShowItemHor(this.animeIdx);
                    break;
                case Movement.Vertical:
                    this._animeShowItemVer(this.animeIdx);
                    break;
            }
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
            this.setContentPosition(cc.Vec2.ZERO);
            // this.scrollView.stopAutoScroll()
            // this.scroll
            // this.content.position = cc.Vec2.ZERO
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
        var checkcount = 0;
        var create = null;
        var call = null;
        switch (this.movement) {
            case Movement.Horizontal:
                create = this._createLeftItem;
                call = this._updateHorizontal;
                break;
            case Movement.Vertical:
                create = this._createTopItem;
                call = this._updateVertical;
                break;
        }
        /// check top item
        if (this._items.length === 0 && create.call(this, idx, pos) == null) {
            return false;
        }
        /// create other items
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
    //// 下面的函数都是重写scrollview 原有的函数
    //// stop anime moveing on touch began
    // _onTouchBegan( event: cc.Event, captureListeners: any){
    //     super._onTouchBegan( event, captureListeners)
    //     if( event.isStopped){ this.bAnimeMoveing = false }
    // }
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
            this.leftBoundary = this._leftBoundary - this.cacheBoundary;
            this.rightBoundary = this._rightBoundary + this.cacheBoundary;
            this.topBoundary = this._topBoundary + this.cacheBoundary;
            this.bottomBoundary = this._bottomBoundary - this.cacheBoundary;
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
    Object.defineProperty(LoopList.prototype, "_outOfBoundaryAmount", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0NBQTJDO0FBRTNDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQztBQUFBLENBQUMsQ0FBQTtBQUVoQixJQUFBLGtCQUEyRCxFQUExRCxvQkFBTyxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLHNDQUFpQyxDQUFDO0FBRWxFLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQixtREFBVSxDQUFBO0lBQ1YsK0NBQVEsQ0FBQTtBQUNaLENBQUMsRUFIVyxRQUFRLEdBQVIsZ0JBQVEsS0FBUixnQkFBUSxRQUduQjtBQUtEO0lBQXNDLDRCQUFZO0lBSGxEO1FBQUEscUVBdXFCQztRQWpxQkcsY0FBUSxHQUFhLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFHL0IsbUJBQWEsR0FBVyxHQUFHLENBQUE7UUFHM0Isb0JBQWMsR0FBVyxFQUFFLENBQUE7UUFFbkMsWUFBWTtRQUNKLGVBQVMsR0FBb0MsSUFBSSxDQUFBO1FBQ2pELGdCQUFVLEdBQWlDLEVBQUUsQ0FBQTtRQUM3QyxlQUFTLEdBQVcsSUFBSSxDQUFBLENBQUMsZUFBZTtRQUN4QyxrQkFBWSxHQUFpRCxJQUFJLENBQUE7UUFDakUsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDL0Isd0JBQXdCO1FBQ2hCLFlBQU0sR0FBbUIsRUFBRSxDQUFBO1FBQ25DLGdEQUFnRDtRQUN4QyxpQkFBVyxHQUFXLENBQUMsQ0FBQTtRQUUvQix1Q0FBdUM7UUFDL0Isa0JBQVksR0FBVyxDQUFDLENBQUE7UUFDeEIsbUJBQWEsR0FBVyxDQUFDLENBQUE7UUFDekIsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDdkIsb0JBQWMsR0FBVyxDQUFDLENBQUE7UUFDbEMsVUFBVTtRQUNGLG1CQUFhLEdBQWEsQ0FBQyxDQUFBO1FBQzNCLHFCQUFlLEdBQVcsQ0FBQyxDQUFBO1FBQzNCLG9CQUFjLEdBQVksQ0FB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QUFDLENBQUM7OENBQ2pCO0lBR3ZDO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7bURBQ2U7SUFHbkM7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQztvREFDYTtJQTBCbkM7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQztnREFDZTtJQW5DdkIsUUFBUTtRQUg1QixPQUFPO1FBQ1AsZ0JBQWdCLEVBQUU7UUFDbEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDO09BQ1IsUUFBUSxDQW9xQjVCO0lBQUQsZUFBQztDQXBxQkQsQUFvcUJDLENBcHFCcUMsRUFBRSxDQUFDLFNBQVMsR0FvcUJqRDtrQkFwcUJvQixRQUFRIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvb3BMaXN0SXRlbSAgZnJvbSBcIi4vTG9vcExpc3RJdGVtXCI7XHJcblxyXG5jb25zdCBFUFNJTE9OID0gMWUtNDsxXHJcblxyXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHksIG1lbnUsIGRpc2FsbG93TXVsdGlwbGV9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbmV4cG9ydCBlbnVtIE1vdmVtZW50e1xyXG4gICAgSG9yaXpvbnRhbCxcclxuICAgIFZlcnRpY2FsLFxyXG59XHJcblxyXG5AY2NjbGFzc1xyXG5AZGlzYWxsb3dNdWx0aXBsZSgpXHJcbkBtZW51KFwiVUlFeHRlbnNpb24vTG9vcExpc3RcIilcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vcExpc3QgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG5cclxuICAgIEBwcm9wZXJ0eSgge3R5cGU6Y2MuRW51bShNb3ZlbWVudCksIHNlcmlhbGl6YWJsZTogdHJ1ZX0pXHJcbiAgICBtb3ZlbWVudDogTW92ZW1lbnQgPSBNb3ZlbWVudC5WZXJ0aWNhbDtcclxuICAgIFxyXG4gICAgQHByb3BlcnR5KCBjYy5GbG9hdClcclxuICAgIHByaXZhdGUgY2FjaGVCb3VuZGFyeTogbnVtYmVyID0gMjAwXHJcblxyXG4gICAgQHByb3BlcnR5KCBjYy5JbnRlZ2VyKVxyXG4gICAgcHJpdmF0ZSBmcmFtZUNyZWF0ZU1heDogbnVtYmVyID0gMzBcclxuXHJcbiAgICAvLy8gaXRlbSDnvJPlrZjmsaBcclxuICAgIHByaXZhdGUgX2l0ZW1Qb29sOiB7IFtrZXk6c3RyaW5nXTogTG9vcExpc3RJdGVtW119ID0gbnVsbFxyXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGVzOiB7W2tleTpzdHJpbmddOiBMb29wTGlzdEl0ZW19ID0ge31cclxuICAgIHByaXZhdGUgX3RlbXBsYXRlOiBzdHJpbmcgPSBudWxsIC8vLyDpu5jorqTkvb/nlKjnmoRwcmVmYWJcclxuICAgIHByaXZhdGUgX2l0ZW1DcmVhdG9yOiAoIHZpZXc6IExvb3BMaXN0LCBpZHg6IG51bWJlcik9Pkxvb3BMaXN0SXRlbSA9IG51bGxcclxuICAgIHByaXZhdGUgX3RvdGFsY291bnQ6IG51bWJlciA9IDBcclxuICAgIC8vLyBjdXJyZW50IGRpc3BsYXkgaXRlbVxyXG4gICAgcHJpdmF0ZSBfaXRlbXM6IExvb3BMaXN0SXRlbVtdID0gW11cclxuICAgIC8vLyBtYXggcGFkZGluZyDljLrliIblm57mlLbovrnnlYzlkozliJvlu7rovrnnlYwg6YG/5YWNcGFkZGluZyDpgKDmiJDnmoTph43lpI3liJvlu7rlkozlm57mlLZcclxuICAgIHByaXZhdGUgX21heFBhZGRpbmc6IG51bWJlciA9IDBcclxuXHJcbiAgICAvLy8g57yT5a2Y6L6555WMIHJlY3ljbGUgJiBjcmVhdGUgaXRlbSBib3VuZGFyeVxyXG4gICAgcHJpdmF0ZSBsZWZ0Qm91bmRhcnk6IG51bWJlciA9IDBcclxuICAgIHByaXZhdGUgcmlnaHRCb3VuZGFyeTogbnVtYmVyID0gMFxyXG4gICAgcHJpdmF0ZSB0b3BCb3VuZGFyeTogbnVtYmVyID0gMFxyXG4gICAgcHJpdmF0ZSBib3R0b21Cb3VuZGFyeTogbnVtYmVyID0gMFxyXG4gICAgLy8vIOS4iuS4i+W3puWPs+i+ueeVjFxyXG4gICAgcHJpdmF0ZSBfbGVmdEJvdW5kYXJ5OiBudW1iZXIgICA9IDBcclxuICAgIHByaXZhdGUgX2JvdHRvbUJvdW5kYXJ5OiBudW1iZXIgPSAwIFxyXG4gICAgcHJpdmF0ZSBfcmlnaHRCb3VuZGFyeTogbnVtYmVyICA9IDBcclxuICAgIHByaXZhdGUgX3RvcEJvdW5kYXJ5OiBudW1iZXIgICAgPSAwXHJcblxyXG4gICAgLy8vIOinhuWPo1xyXG4gICAgQHByb3BlcnR5KCBjYy5TY3JvbGxWaWV3KVxyXG4gICAgcHJpdmF0ZSBzY3JvbGxWaWV3OiBjYy5TY3JvbGxWaWV3ID0gbnVsbFxyXG4gICAgZ2V0IGNvbnRlbnQoKTogY2MuTm9kZSB7IHJldHVybiB0aGlzLnNjcm9sbFZpZXcuY29udGVudH1cclxuICAgIGdldCB2aWV3UG9ydCgpOmNjLk5vZGUgeyByZXR1cm4gdGhpcy5jb250ZW50LnBhcmVudH1cclxuXHJcbiAgICBvbkxvYWQoKXtcclxuICAgICAgICAvLy8g5Y+q5YWB6K645LiA5Liq5pa55ZCRXHJcbiAgICAgICAgaWYoIHRoaXMuc2Nyb2xsVmlldyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVmlldyA9IHRoaXMuZ2V0Q29tcG9uZW50KCBjYy5TY3JvbGxWaWV3KVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8g6YeN572uc2Nyb2xsdmlldyDmu5rliqjlsZ7mgKdcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuaG9yaXpvbnRhbCA9IHRoaXMubW92ZW1lbnQgPT0gTW92ZW1lbnQuSG9yaXpvbnRhbFxyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy52ZXJ0aWNhbCA9IHRoaXMubW92ZW1lbnQgPT0gTW92ZW1lbnQuVmVydGljYWxcclxuICAgICAgICAvLy8g6YeN5a6a5ZCRc2Nyb2xsdmlldyDlh73mlbBcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkuYmluZCh0aGlzKVxyXG4gICAgICAgIHRoaXMuc2Nyb2xsVmlldy5fY2FsY3VsYXRlQm91bmRhcnkgPSB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeS5iaW5kKHRoaXMpXHJcbiAgICAgICAgaWYoIHRoaXMuY29udGVudCkge1xyXG4gICAgICAgICAgICAvLy8gaW5pdGlhbGl6ZSBjb250ZW50IHZpZXdcclxuICAgICAgICAgICAgbGV0IGFuY2ggPSB0aGlzLnNjcm9sbFZpZXcuaG9yaXpvbnRhbD8gY2MudjIoIDAsIDAuNSk6IGNjLnYyKCAwLjUsIDEpXHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRBbmNob3JQb2ludCggYW5jaCkgXHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRQb3NpdGlvbiggY2MuVmVjMi5aRVJPKVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gaW5pdGlhbGl6ZSBkYXRhXHJcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkoKVxyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlKCl7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Lm5vZGUub24oIFwic2Nyb2xsaW5nXCIsIHRoaXMub25TY3JvbGxpbmcsIHRoaXMpXHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCl7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Lm5vZGUub2ZmKCBcInNjcm9sbGluZ1wiLCB0aGlzLm9uU2Nyb2xsaW5nLCB0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyBpbml0aWFsaXplIHRvdGFsIGNvdW50LCBpdGVtIGNyZWF0b3JcclxuICAgIGluaXRpYWxpemUoY3JlYXRvcjooIHZpZXc6IExvb3BMaXN0LCBpZHg6IG51bWJlcik9Pkxvb3BMaXN0SXRlbSwgY291bnQ6IG51bWJlciA9IDApe1xyXG4gICAgICAgIHRoaXMuX3RvdGFsY291bnQgPSBjb3VudCB8fCAwXHJcbiAgICAgICAgdGhpcy5faXRlbUNyZWF0b3IgPSBjcmVhdG9yXHJcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZVBvb2woKVxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KCkgXHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOiuvue9ruW9k+WJjWl0ZW0gY291bnQg5aaC5p6c5LiN5piv5by65Yi2UmVzZXRcclxuICAgIC8vLyDpgqPkuYjlpKfkuo7nrYnkuo7lvZPliY1pdGVtY291dCB8fCDmnIDlkI7kuIDpoblpdGVt5LiN5pivIOW9k+WJjWl0ZW0g6Ieq5Yqo5L2/55So5Yi35paw5pa55byP5LiN5Lya5L+u5pS55b2T5YmNaXRlbSDnmoTmmL7npLrkvY3nva5cclxuICAgIHNldEl0ZW1Db3VudCggY291bnQ6IG51bWJlciwgYlJlc2V0OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiggYlJlc2V0KSB7IFxyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnRQb3NpdGlvbiggY2MuVmVjMi5aRVJPKSBcclxuICAgICAgICAgICAgdGhpcy5fdG90YWxjb3VudCA9IGNvdW50XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0l0ZW0oIDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG9sZGNvdW50ID0gdGhpcy5fdG90YWxjb3VudFxyXG4gICAgICAgICAgICB0aGlzLl90b3RhbGNvdW50ID0gY291bnRcclxuICAgICAgICAgICAgLy8vIOWmguaenOaWsOeahGl0ZW0gY291bnQg5aSn5LqOIG9sZEl0ZW1jb3VudOmCo+S5iOWkp+S6juetieS6juW9k+WJjWl0ZW1jb3V0XHJcbiAgICAgICAgICAgIGxldCBsYXN0SXRlbSA9IHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDA/IHRoaXMuX2l0ZW1zWyB0aGlzLl9pdGVtcy5sZW5ndGgtMV06IG51bGxcclxuICAgICAgICAgICAgaWYoIGNvdW50ID49IG9sZGNvdW50IHx8IChsYXN0SXRlbSAhPSBudWxsICYmIGxhc3RJdGVtLml0ZW1JZHggPCAoY291bnQgLTEpKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoSXRlbXMoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93SXRlbSggY291bnQgLSAxKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgIFxyXG4gICAgLy8vIOWIt+aWsOW9k+WJjeaJgOaciWl0ZW1cclxuICAgIHJlZnJlc2hJdGVtcygpIHtcclxuICAgICAgICBpZiggdGhpcy5fdG90YWxjb3VudCA+IDAgJiYgdGhpcy5faXRlbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgZnJpc3RJdGVtICAgPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBsZXQgcG9zICAgICAgICAgPSBmcmlzdEl0ZW0ubm9kZS5wb3NpdGlvblxyXG4gICAgICAgICAgICBsZXQgaXRlbUlkeCAgICAgPSBmcmlzdEl0ZW0uaXRlbUlkeFxyXG4gICAgICAgICAgICAvLy8gY3JlYXRlIHRvcCBpdGVtXHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcygpXHJcbiAgICAgICAgICAgIGxldCBhcmcgPSB0aGlzLm1vdmVtZW50ID09IE1vdmVtZW50Lkhvcml6b250YWw/IHBvcy54OiBwb3MueVxyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0VmlldyggaXRlbUlkeCwgYXJnKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGlzdFZpZXcoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy8g55u05o6l5bGV56S6aXRlbSDliLBpZHhcclxuICAgIHByaXZhdGUgYW5pbWVJZHg6IG51bWJlciA9IDBcclxuICAgIHByaXZhdGUgYkFuaW1lTW92ZWluZzogYm9vbGVhbiA9IGZhbHNlXHJcbiAgICBzaG93SXRlbSggaWR4OiBudW1iZXIsIGJBbmltZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgLy8g6ZmQ5a6a5YiwIDAgLSDvvIh0b3RhbGNvdW50IC0x77yJ6IyD5Zu05YaFXHJcbiAgICAgICAgaWR4ID0gTWF0aC5taW4oIHRoaXMuX3RvdGFsY291bnQgLSAxLCBNYXRoLm1heCgwLCBpZHgpKSBcclxuICAgICAgICBpZiggYkFuaW1lKSB7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYW5pbWVJZHggPSBpZHg7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYkFuaW1lTW92ZWluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc2Nyb2xsVG9Cb3R0b20oIDEpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8vIOWbnuaUtuaJgOaciWl0ZW1zIOS7juaWsOWIm+W7unRvcCBpdGVtXHJcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hvd0l0ZW1Ib3IoIGlkeClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5WZXJ0aWNhbDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaG93SXRlbVZlciggaWR4KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOiOt+WPluS4gOS4qml0ZW0gXHJcbiAgICBnZXRJdGVtKCBrZXk6IHN0cmluZyA9IG51bGwpOiBMb29wTGlzdEl0ZW0ge1xyXG4gICAgICAgIGtleSA9IGtleSB8fCB0aGlzLl90ZW1wbGF0ZVxyXG4gICAgICAgIGxldCBwb29sID0gdGhpcy5faXRlbVBvb2xba2V5XVxyXG4gICAgICAgIGxldCBpbnN0YW5jZTogTG9vcExpc3RJdGVtID0gKHBvb2wgJiYgcG9vbC5sZW5ndGggPiAwKT8gcG9vbC5wb3AoKTogbnVsbFxyXG4gICAgICAgIGlmICggaW5zdGFuY2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgcHJlZmFiID0gdGhpcy5fdGVtcGxhdGVzW2tleV1cclxuICAgICAgICAgICAgaWYoIHByZWZhYiAhPSBudWxsKSB7IFxyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBjYy5pbnN0YW50aWF0ZSggcHJlZmFiLm5vZGUpIFxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBub2RlLmdldENvbXBvbmVudCggTG9vcExpc3RJdGVtKVxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuaXRlbUtleSA9IGtleVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpbnN0YW5jZVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2l0ZW1TaXplRGlydHk6IGJvb2xlYW4gPSB0cnVlXHJcbiAgICBpdGVtU2l6ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pdGVtRGlydHk6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgb25TY3JvbGxpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSggZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtU2l6ZURpcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1TaXplRGlydHkgPSBmYWxzZVxyXG4gICAgICAgICAgICBzd2l0Y2goIHRoaXMubW92ZW1lbnQpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5Ib3Jpem9udGFsOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUhvcml6b250YWxJdGVtcygpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuVmVydGljYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlVmVydGljYWxJdGVtcygpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiggdGhpcy5faXRlbURpcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1EaXJ0eSA9IGZhbHNlXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RWaWV3KClcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIOWKqOeUu+enu+WKqFxyXG4gICAgICAgIC8vIHRoaXMuYkFuaW1lTW92ZWluZyA9IHRoaXMuX3Njcm9cclxuICAgICAgICBpZiggdGhpcy5iQW5pbWVNb3ZlaW5nKSB7XHJcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWVTaG93SXRlbUhvciggdGhpcy5hbmltZUlkeClcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5WZXJ0aWNhbDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hbmltZVNob3dJdGVtVmVyKCB0aGlzLmFuaW1lSWR4KVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5pdGlhbGl6ZVBvb2woKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1Qb29sID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faXRlbVBvb2wgPSB7fVxyXG4gICAgICAgICAgICBsZXQgcHJlZmFicyA9IHRoaXMuY29udGVudC5nZXRDb21wb25lbnRzSW5DaGlsZHJlbiggTG9vcExpc3RJdGVtKVxyXG4gICAgICAgICAgICBwcmVmYWJzLmZvckVhY2goIGl0ZW09PntcclxuICAgICAgICAgICAgICAgIC8vLyBzYXZlIHRlbXBsYXRlcyBcclxuICAgICAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLml0ZW1LZXkgPSBpdGVtLm5vZGUubmFtZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgICAgICAgICAgPSB0aGlzLl90ZW1wbGF0ZSA9PSBudWxsPyBrZXk6IHRoaXMuX3RlbXBsYXRlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZXNba2V5XSAgICA9IGl0ZW1cclxuICAgICAgICAgICAgICAgIHRoaXMuX21heFBhZGRpbmcgICAgICAgID0gTWF0aC5tYXgoIHRoaXMuX21heFBhZGRpbmcsIGl0ZW0ucGFkZGluZysyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggaXRlbSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRDb250ZW50UG9zaXRpb24oIHBvczogY2MuVmVjMil7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3LnN0b3BBdXRvU2Nyb2xsKClcclxuICAgICAgICBpZiggdGhpcy5zY3JvbGxWaWV3LmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxWaWV3LmNvbnRlbnQucG9zaXRpb24gPSBwb3NcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hvd0l0ZW1WZXIoIGlkeDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8vIOWIpOaWreesrOS4gOS4quWSjOacgOWQjuS4gOS4qumDveWcqOeql+WPo+WGheWwseS4jeeUqOaJp+ihjOS6hlxyXG4gICAgICAgIGxldCBmcmlzdCA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgbGV0IGxhc3QgPSB0aGlzLl9pdGVtc1t0aGlzLl9pdGVtcy5sZW5ndGggLTFdXHJcbiAgICAgICAgaWYoIGZyaXN0Lml0ZW1JZHggPT09IDAgJiYgbGFzdC5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudC0xKSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbVRvcCggZnJpc3QpIDw9IHRoaXMuX3RvcEJvdW5kYXJ5ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbUJvdHRvbSggbGFzdCkgPj0gdGhpcy5fYm90dG9tQm91bmRhcnkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDlm57mlLblvZPliY3miYDmnIlpdGVtICYgcmVzZXQgY29udGVudCBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICBpZiggdGhpcy5fdXBkYXRlTGlzdFZpZXcoIGlkeCkpe1xyXG4gICAgICAgICAgICAvLy8g5Yik5pat5pyA5ZCO5LiA5p2h5piv5ZCm5Zyo56qX5Y+j5YaF6YOo6ZyA6KaB6Z2g56qX5Y+j5bqV6YOoXHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbIHRoaXMuX2l0ZW1zLmxlbmd0aCAtMV1cclxuICAgICAgICAgICAgaWYoIGl0ZW0uaXRlbUlkeCA9PT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgYm90dG9tID0gdGhpcy5fZ2V0SXRlbUJvdHRvbSggaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmKCBib3R0b20gPiB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC55ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgLSBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICAvLy8g56e75Yqo56qX5Y+j5ZCO6ZyA6KaB6YeN5paw5Yqg6L296aG26YOoaXRlbSAmXHJcbiAgICAgICAgICAgICAgICAgICAgLy8vIOWIpOaWrSB0b3BpdGVtIOaYr+WQpuWcqOmhtumDqOi+ueeVjOmHjOmdouWOu+S6hlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLl91cGRhdGVMaXN0VmlldygpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRpdGVtID0gdGhpcy5faXRlbXNbMF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRpdGVtLml0ZW1JZHggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLl9nZXRJdGVtVG9wKCB0aXRlbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0b3AgPCB0aGlzLl90b3BCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC55ID0gdGhpcy5jb250ZW50LnkgKyAodGhpcy5fdG9wQm91bmRhcnkgLSB0b3ApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8vIOagh+iusGl0ZW0g6ZyA6KaB6YeN5paw5Yib5bu65Zue5pS2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faXRlbURpcnR5ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Nob3dJdGVtSG9yKCBpZHg6IG51bWJlcil7XHJcbiAgICAgICAgLy8vIOWIpOaWreesrOS4gOS4quWSjOacgOWQjuS4gOS4qumDveWcqOeql+WPo+WGheWwseS4jeeUqOaJp+ihjOS6hlxyXG4gICAgICAgIGxldCBmcmlzdCA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgbGV0IGxhc3QgPSB0aGlzLl9pdGVtc1t0aGlzLl9pdGVtcy5sZW5ndGggLTFdXHJcbiAgICAgICAgaWYoIGZyaXN0Lml0ZW1JZHggPT09IDAgJiYgbGFzdC5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudC0xKSAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2V0SXRlbUxlZnQoIGZyaXN0KSA+PSB0aGlzLl9sZWZ0Qm91bmRhcnkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZXRJdGVtUmlnaHQoIGxhc3QpIDw9IHRoaXMuX3JpZ2h0Qm91bmRhcnkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyDlm57mlLblvZPliY3miYDmnIlpdGVtICYgcmVzZXQgY29udGVudCBwb3NpdGlvblxyXG4gICAgICAgIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcclxuICAgICAgICBpZiggdGhpcy5fdXBkYXRlTGlzdFZpZXcoIGlkeCkpIHtcclxuICAgICAgICAgICAgLy8vIOWIpOaWreacgOWQjuS4gOadoeaYr+WQpuWcqOeql+WPo+WGhemDqOmcgOimgemdoOeql+WPo+WPs+i+uVxyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zWyB0aGlzLl9pdGVtcy5sZW5ndGggLTFdXHJcbiAgICAgICAgICAgIGlmKCBpdGVtLml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0gMSkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5fZ2V0SXRlbVJpZ2h0KCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYoIHJpZ2h0IDwgdGhpcy5fcmlnaHRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudC54ID0gdGhpcy5fcmlnaHRCb3VuZGFyeSAtIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgLy8vIOWIpOaWrSBsZWZ0aXRlbSDmmK/lkKblnKjlt6bovrnnlYzovrnnlYzph4zpnaLljrvkuoZcclxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5fdXBkYXRlTGlzdFZpZXcoKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0aXRlbSA9IHRoaXMuX2l0ZW1zWzBdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGVmdCA9IHRoaXMuX2dldEl0ZW1MZWZ0KCB0aXRlbSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiY3JlYXRlIGxlZnQgaXRlbXMhXCIsIGxlZnQsIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBsZWZ0ID4gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50LnggPSB0aGlzLmNvbnRlbnQueCAtIChsZWZ0IC0gdGhpcy5fbGVmdEJvdW5kYXJ5KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLyDmoIforrBpdGVtIOmcgOimgemHjeaWsOWIm+W7uuWbnuaUtlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1EaXJ0eSA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hbmltZVNob3dJdGVtVmVyKCBpZHg6IG51bWJlcil7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FuaW1lU2hvd0l0ZW1Ib3IoIGlkeDogbnVtYmVyKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlY3ljbGUoaXRlbTogTG9vcExpc3RJdGVtKSB7XHJcbiAgICAgICAgbGV0IHBvb2wgPSB0aGlzLl9pdGVtUG9vbFtpdGVtLml0ZW1LZXldXHJcbiAgICAgICAgaWYoIHBvb2wgPT0gbnVsbCkgeyBwb29sID0gdGhpcy5faXRlbVBvb2xbaXRlbS5pdGVtS2V5XSA9IFtdIH1cclxuICAgICAgICBpdGVtLm5vZGUuYWN0aXZlID0gZmFsc2VcclxuICAgICAgICBpdGVtLmxvb3BsaXN0ID0gbnVsbFxyXG4gICAgICAgIHBvb2wucHVzaCggaXRlbSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfcmVjeWNsZUFsbEl0ZW1zKCByZXNldDpib29sZWFuID0gZmFsc2Upe1xyXG4gICAgICAgIHRoaXMuX2l0ZW1zLmZvckVhY2goIGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCBpdGVtKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gW11cclxuICAgICAgICBpZiggcmVzZXQpIHsgdGhpcy5zZXRDb250ZW50UG9zaXRpb24oIGNjLlZlYzIuWkVSTylcclxuICAgICAgICAgICAgLy8gdGhpcy5zY3JvbGxWaWV3LnN0b3BBdXRvU2Nyb2xsKClcclxuICAgICAgICAgICAgLy8gdGhpcy5zY3JvbGxcclxuICAgICAgICAgICAgLy8gdGhpcy5jb250ZW50LnBvc2l0aW9uID0gY2MuVmVjMi5aRVJPXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZU5ld0l0ZW0oIGlkeDogbnVtYmVyKTogTG9vcExpc3RJdGVtIHtcclxuICAgICAgICBpZiggaWR4IDwgMCB8fCBpZHggPj0gdGhpcy5fdG90YWxjb3VudCkgcmV0dXJuIG51bGwgXHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtQ3JlYXRvcj8gdGhpcy5faXRlbUNyZWF0b3IoIHRoaXMsIGlkeCkgOiBudWxsXHJcbiAgICAgICAgaWYoIGl0ZW0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpdGVtLm5vZGUucG9zaXRpb24gPSBjYy5WZWMyLlpFUk87IGl0ZW0uaXRlbUlkeCA9IGlkeDsgXHJcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpdGVtLmxvb3BsaXN0ID0gdGhpczsgXHJcbiAgICAgICAgICAgIGl0ZW0ubm9kZS5wYXJlbnQgPSB0aGlzLmNvbnRlbnRcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRJdGVtQXQoIGlkeDogbnVtYmVyKTogTG9vcExpc3RJdGVte1xyXG4gICAgICAgIGZvciggbGV0IGk9MDsgaTx0aGlzLl9pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW2ldIFxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09IGlkeCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEl0ZW1Ub3AoIGl0ZW06IExvb3BMaXN0SXRlbSk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubm9kZS55ICsgdGhpcy5jb250ZW50LnlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRJdGVtQm90dG9tKCBpdGVtOiBMb29wTGlzdEl0ZW0pOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpdGVtdG9wID0gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSlcclxuICAgICAgICByZXR1cm4gaXRlbXRvcCAtIGl0ZW0ubm9kZS5oZWlnaHQgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0SXRlbUxlZnQoIGl0ZW06IExvb3BMaXN0SXRlbSk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubm9kZS54ICsgdGhpcy5jb250ZW50LnggLy8gKyBpdGVtLm9mZnNldFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEl0ZW1SaWdodCggaXRlbTogTG9vcExpc3RJdGVtKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgaXRlbUxlZnQgPSB0aGlzLl9nZXRJdGVtTGVmdCggaXRlbSlcclxuICAgICAgICByZXR1cm4gaXRlbUxlZnQgKyBpdGVtLm5vZGUud2lkdGhcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVMaXN0VmlldyggaWR4OiBudW1iZXIgPSAwLCBwb3M6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAvLy8gcmVjeWNsZSBhbGwgaXRlbXNcclxuICAgICAgICBpZiggdGhpcy5fdG90YWxjb3VudCA9PSAwICYmIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIGN1ciBjb3VudFxyXG4gICAgICAgIGxldCBjaGVja2NvdW50ID0gMFxyXG4gICAgICAgIGxldCBjcmVhdGU6ICggaWR4OiBudW1iZXIsIHBvczogbnVtYmVyKT0+IExvb3BMaXN0SXRlbSAgPSBudWxsXHJcbiAgICAgICAgbGV0IGNhbGw6ICgpPT5ib29sZWFuID0gbnVsbFxyXG4gICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCkge1xyXG4gICAgICAgICAgICBjYXNlIE1vdmVtZW50Lkhvcml6b250YWw6XHJcbiAgICAgICAgICAgICAgICBjcmVhdGUgPSB0aGlzLl9jcmVhdGVMZWZ0SXRlbTsgXHJcbiAgICAgICAgICAgICAgICBjYWxsID0gdGhpcy5fdXBkYXRlSG9yaXpvbnRhbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuVmVydGljYWw6XHJcbiAgICAgICAgICAgICAgICBjcmVhdGUgPSB0aGlzLl9jcmVhdGVUb3BJdGVtO1xyXG4gICAgICAgICAgICAgICAgIGNhbGwgPSB0aGlzLl91cGRhdGVWZXJ0aWNhbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vLyBjaGVjayB0b3AgaXRlbVxyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPT09IDAgJiYgY3JlYXRlLmNhbGwoIHRoaXMsIGlkeCwgcG9zKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gY3JlYXRlIG90aGVyIGl0ZW1zXHJcbiAgICAgICAgd2hpbGUoIGNhbGwuY2FsbCggdGhpcykpIHtcclxuICAgICAgICAgICAgaWYoICsrY2hlY2tjb3VudCA+PSB0aGlzLmZyYW1lQ3JlYXRlTWF4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtRGlydHkgPSB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVUb3BJdGVtKCBpZHg6IG51bWJlciwgeTogbnVtYmVyID0gbnVsbCk6IExvb3BMaXN0SXRlbSB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCBpZHgpXHJcbiAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYoIHkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSAtdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSkgKyB0aGlzLl90b3BCb3VuZGFyeSAtIGl0ZW0ub2Zmc2V0XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pdGVtcy5wdXNoKCBpdGVtKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDku47mlrDmjpLluo9pdGVtc1xyXG4gICAgcHJpdmF0ZSBfdXBkYXRlVmVydGljYWxJdGVtcygpIHtcclxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBsZXQgcGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBmb3IoIGxldCBpZHg9MTsgaWR4IDwgdGhpcy5faXRlbXMubGVuZ3RoOyBpZHgrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW2lkeF1cclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gcGl0ZW0ubm9kZS55IC0gcGl0ZW0ubm9kZS5oZWlnaHQgLSBpdGVtLnBhZGRpbmdcclxuICAgICAgICAgICAgICAgIHBpdGVtID0gaXRlbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZVZlcnRpY2FsKCkgOiBib29sZWFuIHtcclxuICAgICAgICAvLyBpZiggdGhpcy5fY2hlY2tSZWN5Y2xlKCkgKSB7IHJldHVybiBmYWxzZX1cclxuICAgICAgICAvLyAvLy8gZmlsbCB1cCAmIGZpbGwgZG93blxyXG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxyXG4gICAgICAgIC8vIGlmKCBjdXJDb3VudCA9PT0gMCkge1xyXG4gICAgICAgIC8vICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZVRvcEl0ZW0oMClcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGl0ZW0gIT0gbnVsbFxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLy8gcmVjeWNsZSB0b3AgaXRlbSDlm57mlLbpobbpg6jmlbDmja4g5aaC5p6c5pyA5bqV5LiL55qEaXRlbSDmmK/mnIDlkI7kuIDmnaHpgqPkuYjkuI3lm57mlLbkuIrpnaLnmoRpdGVtXHJcbiAgICAgICAgbGV0IHRvcGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgIGxldCBib3R0b21pdGVtID0gdGhpcy5faXRlbXNbIGN1ckNvdW50LTFdXHJcbiAgICAgICAgbGV0IGJvdHRvbV9ib3R0b20gPSB0aGlzLl9nZXRJdGVtQm90dG9tKCBib3R0b21pdGVtKVxyXG4gICAgICAgIGlmKCBjdXJDb3VudCA+IDEpIHtcclxuICAgICAgICAgICAgLy8vIHJlY3ljbGUgdG9wIGl0ZW1cclxuICAgICAgICAgICAgbGV0IGNhblJlY3ljbGVUb3AgPSAoYm90dG9taXRlbS5pdGVtSWR4ICE9PSB0aGlzLl90b3RhbGNvdW50LTEgfHwgYm90dG9tX2JvdHRvbSA8IHRoaXMuX2JvdHRvbUJvdW5kYXJ5KVxyXG4gICAgICAgICAgICBpZiggY2FuUmVjeWNsZVRvcCAmJiB0aGlzLl9nZXRJdGVtQm90dG9tKCB0b3BpdGVtKSA+ICh0aGlzLnRvcEJvdW5kYXJ5ICsgdGhpcy5fbWF4UGFkZGluZykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMSlcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIHRvcGl0ZW0pXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAvLy8gcmVjeWNsZSBib3R0b20gaXRlbVxyXG4gICAgICAgICAgICBpZiggdG9waXRlbS5pdGVtSWR4ID4gMCAmJiB0aGlzLl9nZXRJdGVtVG9wKCBib3R0b21pdGVtKSA8ICh0aGlzLmJvdHRvbUJvdW5kYXJ5IC0gdGhpcy5fbWF4UGFkZGluZykpIHsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIGN1ckNvdW50LTEsIDEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCBib3R0b21pdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gY3JlYXRlIHRvcCBpdGVtXHJcbiAgICAgICAgaWYoIHRoaXMuX2dldEl0ZW1Ub3AoIHRvcGl0ZW0pIDwgdGhpcy50b3BCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIHRvcGl0ZW0uaXRlbUlkeCAtIDEpXHJcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHRvcGl0ZW0ubm9kZS55ICsgaXRlbS5wYWRkaW5nICsgaXRlbS5ub2RlLmhlaWdodFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gY3JlYXRlIGJvdHRvbSBpdGVtXHJcbiAgICAgICAgaWYoIGJvdHRvbV9ib3R0b20gPiB0aGlzLmJvdHRvbUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggYm90dG9taXRlbS5pdGVtSWR4ICsgMSlcclxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gYm90dG9taXRlbS5ub2RlLnkgLSBib3R0b21pdGVtLm5vZGUuaGVpZ2h0IC0gYm90dG9taXRlbS5wYWRkaW5nXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5wdXNoKCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jcmVhdGVMZWZ0SXRlbSggaWR4OiBudW1iZXIsIHg6bnVtYmVyID0gbnVsbCkgOiBMb29wTGlzdEl0ZW17XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCBpZHgpXHJcbiAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgaWYoIHggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSAtdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pICsgdGhpcy5fbGVmdEJvdW5kYXJ5ICsgaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0geFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlSG9yaXpvbnRhbEl0ZW1zKCl7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgbGV0IHByZWl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBmb3IoIGxldCBpZHg9MTsgaWR4IDwgdGhpcy5faXRlbXMubGVuZ3RoOyBpZHgrKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW2lkeF1cclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gcHJlaXRlbS5ub2RlLnggKyBwcmVpdGVtLm5vZGUuaGVpZ2h0ICsgaXRlbS5wYWRkaW5nXHJcbiAgICAgICAgICAgICAgICBwcmVpdGVtID0gaXRlbVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZUhvcml6b250YWwoKTogYm9vbGVhbntcclxuICAgICAgICAvLyBpZiggdGhpcy5fY2hlY2tSZWN5Y2xlKCkpIHsgcmV0dXJuIGZhbHNlfVxyXG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxyXG4gICAgICAgIC8vIGlmKCBjdXJDb3VudCA9PSAwKSB7XHJcbiAgICAgICAgLy8gICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTGVmdEl0ZW0oMClcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGl0ZW0gIT0gbnVsbD8gdHJ1ZTogZmFsc2VcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8vIGZpbGwgbGVmdCAmIGZpbGwgcmlnaHRcclxuICAgICAgICBsZXQgbGVmdEl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgIGxldCByaWdodEl0ZW0gPSB0aGlzLl9pdGVtc1sgY3VyQ291bnQtMV1cclxuICAgICAgICBsZXQgcmlnaHRfcmlnaHQgPSB0aGlzLl9nZXRJdGVtUmlnaHQoIHJpZ2h0SXRlbSlcclxuICAgICAgICBpZiggY3VyQ291bnQgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIGxlZnQgaXRlbVxyXG4gICAgICAgICAgICBsZXQgY2FuUmVjeWNsZUxlZnQgPSAocmlnaHRJdGVtLml0ZW1JZHggIT09ICh0aGlzLl90b3RhbGNvdW50IC0gMSkgfHwgcmlnaHRfcmlnaHQgPiB0aGlzLnJpZ2h0Qm91bmRhcnkpXHJcbiAgICAgICAgICAgIGlmKCBjYW5SZWN5Y2xlTGVmdCAmJiB0aGlzLl9nZXRJdGVtUmlnaHQoIGxlZnRJdGVtKSA8ICh0aGlzLmxlZnRCb3VuZGFyeSAtIHRoaXMuX21heFBhZGRpbmcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDEpXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCBsZWZ0SXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8vIHJlY3ljbGUgcmlnaHQgaXRlbVxyXG4gICAgICAgICAgICBpZiggbGVmdEl0ZW0uaXRlbUlkeCA+IDAgJiYgdGhpcy5fZ2V0SXRlbUxlZnQocmlnaHRJdGVtKSA+ICh0aGlzLnJpZ2h0Qm91bmRhcnkgKyB0aGlzLl9tYXhQYWRkaW5nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCBjdXJDb3VudC0xLCAxKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggcmlnaHRJdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gY3JlYXRlIGxlZnQgaXRlbVxyXG4gICAgICAgIGlmKCB0aGlzLl9nZXRJdGVtTGVmdCggbGVmdEl0ZW0pID4gdGhpcy5sZWZ0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCBsZWZ0SXRlbS5pdGVtSWR4IC0gMSlcclxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gbGVmdEl0ZW0ubm9kZS54IC0gaXRlbS5ub2RlLndpZHRoIC0gaXRlbS5wYWRkaW5nIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLy8gY3JlYXRlIGJvdHRvbSBpdGVtXHJcbiAgICAgICAgaWYoIHJpZ2h0X3JpZ2h0IDwgdGhpcy5yaWdodEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggcmlnaHRJdGVtLml0ZW1JZHggKyAxKVxyXG4gICAgICAgICAgICBpZiggaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSByaWdodEl0ZW0ubm9kZS54ICsgcmlnaHRJdGVtLm5vZGUud2lkdGggKyByaWdodEl0ZW0ucGFkZGluZ1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLyDkuIvpnaLnmoTlh73mlbDpg73mmK/ph43lhplzY3JvbGx2aWV3IOWOn+acieeahOWHveaVsFxyXG5cclxuICAgIC8vLy8gc3RvcCBhbmltZSBtb3ZlaW5nIG9uIHRvdWNoIGJlZ2FuXHJcbiAgICAvLyBfb25Ub3VjaEJlZ2FuKCBldmVudDogY2MuRXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnM6IGFueSl7XHJcbiAgICAvLyAgICAgc3VwZXIuX29uVG91Y2hCZWdhbiggZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpXHJcbiAgICAvLyAgICAgaWYoIGV2ZW50LmlzU3RvcHBlZCl7IHRoaXMuYkFuaW1lTW92ZWluZyA9IGZhbHNlIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICAvLy8g6K6h566X6L6555WMXHJcbiAgICBfY2FsY3VsYXRlQm91bmRhcnkoKXtcclxuICAgICAgICBpZiAodGhpcy5jb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5zZXRDb250ZW50U2l6ZSggY2Muc2l6ZSggdGhpcy52aWV3UG9ydC53aWR0aCwgdGhpcy52aWV3UG9ydC5oZWlnaHQpKVxyXG4gICAgICAgICAgICAvLy8gdmlldyBwb3J0XHJcbiAgICAgICAgICAgIGxldCB2aWV3U2l6ZSA9IHRoaXMudmlld1BvcnQuZ2V0Q29udGVudFNpemUoKTtcclxuICAgICAgICAgICAgbGV0IGFuY2hvclggPSB2aWV3U2l6ZS53aWR0aCAqIHRoaXMudmlld1BvcnQuYW5jaG9yWDtcclxuICAgICAgICAgICAgbGV0IGFuY2hvclkgPSB2aWV3U2l6ZS5oZWlnaHQgKiB0aGlzLnZpZXdQb3J0LmFuY2hvclk7XHJcbiAgICAgICAgICAgIC8vLyDorqHnrpfkuIrkuIvlt6blj7PovrnnlYxcclxuICAgICAgICAgICAgdGhpcy5fbGVmdEJvdW5kYXJ5ICA9IC1hbmNob3JYO1xyXG4gICAgICAgICAgICB0aGlzLl9ib3R0b21Cb3VuZGFyeSA9IC1hbmNob3JZO1xyXG4gICAgICAgICAgICB0aGlzLl9yaWdodEJvdW5kYXJ5ID0gdGhpcy5fbGVmdEJvdW5kYXJ5ICsgdmlld1NpemUud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvcEJvdW5kYXJ5ICAgPSB0aGlzLl9ib3R0b21Cb3VuZGFyeSArIHZpZXdTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgLy8vIOiuoeeul+WbnuaUtui+ueeVjFxyXG4gICAgICAgICAgICB0aGlzLmxlZnRCb3VuZGFyeSAgID0gdGhpcy5fbGVmdEJvdW5kYXJ5IC0gdGhpcy5jYWNoZUJvdW5kYXJ5XHJcbiAgICAgICAgICAgIHRoaXMucmlnaHRCb3VuZGFyeSAgPSB0aGlzLl9yaWdodEJvdW5kYXJ5ICsgdGhpcy5jYWNoZUJvdW5kYXJ5XHJcbiAgICAgICAgICAgIHRoaXMudG9wQm91bmRhcnkgICAgPSB0aGlzLl90b3BCb3VuZGFyeSArIHRoaXMuY2FjaGVCb3VuZGFyeVxyXG4gICAgICAgICAgICB0aGlzLmJvdHRvbUJvdW5kYXJ5ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgLSB0aGlzLmNhY2hlQm91bmRhcnlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOijgeWJquenu+WKqOmHj1xyXG4gICAgX2NsYW1wRGVsdGEgKGRlbHRhOiBjYy5WZWMyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDA/IGRlbHRhOiBjYy5WZWMyLlpFUk87XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOmHjeWGmeivpeWHveaVsOWunueOsOW3pui+ueeVjOWbnuW8uSBcclxuICAgIC8vLyBwYWdlVmlldyDkuZ/lj6/ku6XlnKjov5nph4zlrp7njrAgJiDpgJrov4fliKTmlq3lvZPliY3mraPlnKh2aWV3cG9ydCDnmoTnrKzkuIDkuKppdGVtIOeEtuWQjui/lOWbnuivpWl0ZW0g55qE5LiOTGVmdEJvdW5kZGFyeeeahOWFs+ezu1xyXG4gICAgX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkgKCl7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbUxlZnQoIGl0ZW0pIC0gaXRlbS5vZmZzZXRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdEJvdW5kYXJ5XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIOmHjeWGmeivpeWHveaVsOWunueOsOWPs+i+ueeVjOWbnuW8uVxyXG4gICAgX2dldENvbnRlbnRSaWdodEJvdW5kYXJ5ICgpe1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdXHJcbiAgICAgICAgICAgIGlmKCBpdGVtLml0ZW1JZHggPT09ICh0aGlzLl90b3RhbGNvdW50IC0xKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dldEl0ZW1SaWdodCggaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcmlnaHRCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDkuIrovrnnlYzlm57lvLlcclxuICAgIC8vLyBwYWdlVmlldyDkuZ/lj6/ku6XlnKjov5nph4zlrp7njrAgJiDpgJrov4fliKTmlq3lvZPliY3mraPlnKh2aWV3cG9ydCDnmoTnrKzkuIDkuKppdGVtIOeEtuWQjui/lOWbnuivpWl0ZW0g55qE5LiOTGVmdEJvdW5kZGFyeeeahOWFs+ezu1xyXG4gICAgX2dldENvbnRlbnRUb3BCb3VuZGFyeSAoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMuX2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxyXG4gICAgICAgICAgICBpZiggaXRlbS5pdGVtSWR4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbVRvcCggaXRlbSkgKyBpdGVtLm9mZnNldFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl90b3BCb3VuZGFyeVxyXG4gICAgfVxyXG5cclxuICAgIC8vLyDph43lhpnor6Xlh73mlbDlrp7njrDkuIvovrnnlYzlm57lvLlcclxuICAgIF9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkgKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbdGhpcy5faXRlbXMubGVuZ3RoLTFdXHJcbiAgICAgICAgICAgIGlmICggaXRlbS5pdGVtSWR4ID09PSAodGhpcy5fdG90YWxjb3VudCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SXRlbUJvdHRvbSggaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYm90dG9tQm91bmRhcnlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgX291dE9mQm91bmRhcnlBbW91bnQoKTogY2MuVmVjMntcclxuICAgICAgICByZXR1cm4gdGhpcy5zY3JvbGxWaWV3Ll9vdXRPZkJvdW5kYXJ5QW1vdW50XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IF9vdXRPZkJvdW5kYXJ5QW1vdW50KHZhbHVlOiBjYy5WZWMyKXtcclxuICAgICAgICB0aGlzLnNjcm9sbFZpZXcuX291dE9mQm91bmRhcnlBbW91bnQgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBfb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5KCk6IGJvb2xlYW57XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2Nyb2xsVmlldy5fb3V0T2ZCb3VuZGFyeUFtb3VudERpcnR5XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IF9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkoIHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxWaWV3Ll9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSB2YWx1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOmHjeWGmeivpeWHveaVsOWunueOsOi+ueeVjOWbnuW8uVxyXG4gICAgX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5IChhZGRpdGlvbjogY2MuVmVjMil7XHJcbiAgICAgICAgYWRkaXRpb24gPSBhZGRpdGlvbiB8fCBjYy52MigwLCAwKTtcclxuICAgICAgICAvLyDms6jph4rov5nooYzkvJrpgKDmiJDlm57lvLlidWdcclxuICAgICAgICBpZiAoYWRkaXRpb24uZnV6enlFcXVhbHMoY2MudjIoMCwgMCksIEVQU0lMT04pICYmICF0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gY2MudjIoMCwgMCk7XHJcbiAgICAgICAgc3dpdGNoKCB0aGlzLm1vdmVtZW50KSB7XHJcbiAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuSG9yaXpvbnRhbDoge1xyXG4gICAgICAgICAgICAgICAgLy8vIOawtOW5s+aooeW8j+W3puWPs+i+ueeVjFxyXG4gICAgICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gMFxyXG4gICAgICAgICAgICAgICAgbGV0IGxlZnQgPSB0aGlzLl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi54XHJcbiAgICAgICAgICAgICAgICBsZXQgcmlnaHQgPSB0aGlzLl9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSgpICsgYWRkaXRpb24ueFxyXG4gICAgICAgICAgICAgICAgaWYoIGxlZnQgPiB0aGlzLl9sZWZ0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSBsZWZ0XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHJpZ2h0IDwgdGhpcy5fcmlnaHRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueCA9IHRoaXMuX3JpZ2h0Qm91bmRhcnkgLSByaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IGxlZnQgKyBvdXRPZkJvdW5kYXJ5QW1vdW50LnhcclxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMCAmJiB0aGlzLl9pdGVtc1swXS5pdGVtSWR4ID09PSAwICYmIHRlbXAgPj0gdGhpcy5fbGVmdEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueCA9IHRoaXMuX2xlZnRCb3VuZGFyeSAtIGxlZnRcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuVmVydGljYWw6e1xyXG4gICAgICAgICAgICAgICAgLy8vICDlnoLnm7TmqKHlvI/kuIrkuIvovrnnlYxcclxuICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueCA9IDBcclxuICAgICAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLl9nZXRDb250ZW50VG9wQm91bmRhcnkoKSArIGFkZGl0aW9uLnlcclxuICAgICAgICAgICAgICAgIGxldCBib3R0b20gPSB0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSArIGFkZGl0aW9uLnlcclxuICAgICAgICAgICAgICAgIGlmICggdG9wIDwgdGhpcy5fdG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl90b3BCb3VuZGFyeSAtIHRvcFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChib3R0b20gPiB0aGlzLl9ib3R0b21Cb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueSA9IHRoaXMuX2JvdHRvbUJvdW5kYXJ5IC0gYm90dG9tO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vLyDliKTmlq3nrKzkuIDmnaFpdGVtIOiQveS4i+adpeaYr+WQpuS8mui2hei/hyB0b3Bib3VuZGFyeSDlpoLmnpzotoXov4fopoHph43mlrDorqHnrpdcclxuICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IHRvcCArIG91dE9mQm91bmRhcnlBbW91bnQueVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAwICYmIHRoaXMuX2l0ZW1zWzBdLml0ZW1JZHggPT09IDAgJiYgdGVtcCA8PSB0aGlzLl90b3BCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnkgPSB0aGlzLl90b3BCb3VuZGFyeSAtIHRvcFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vIO+8n++8n++8n1xyXG4gICAgICAgIGlmIChhZGRpdGlvbi5mdXp6eUVxdWFscyhjYy52MigwLCAwKSwgRVBTSUxPTikpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudCA9IG91dE9mQm91bmRhcnlBbW91bnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gdGhpcy5fY2xhbXBEZWx0YShvdXRPZkJvdW5kYXJ5QW1vdW50KTtcclxuICAgICAgICByZXR1cm4gb3V0T2ZCb3VuZGFyeUFtb3VudDtcclxuICAgIH1cclxufVxyXG5cclxuIl19