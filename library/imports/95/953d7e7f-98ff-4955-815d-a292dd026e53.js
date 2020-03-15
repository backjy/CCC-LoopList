"use strict";
cc._RF.push(module, '953d75/mP9JVYFdopLdAm5T', 'LoopListGrid');
// looplist/LoopListGrid.ts

Object.defineProperty(exports, "__esModule", { value: true });
var LoopList_1 = require("./LoopList");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, disallowMultiple = _a.disallowMultiple;
var LoopListGrid = /** @class */ (function (_super) {
    __extends(LoopListGrid, _super);
    function LoopListGrid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /// 格子数量 默认为2, 大于2时表示一行有多个或一列有多个 采用 左到右或上到下排列方式
        _this.gridCount = 2;
        /// grid item 开始位置
        _this.centers = [];
        return _this;
    }
    /// 计算grid 的中心
    LoopListGrid.prototype._calculateBoundary = function () {
        _super.prototype._calculateBoundary.call(this);
        if (this.content) {
            this.centers.length = this.gridCount;
            switch (this.movement) {
                case LoopList_1.Movement.Horizontal:
                    {
                        var step = this.content.height / this.gridCount;
                        var start = this.content.height * 0.5 - step * 0.5;
                        for (var idx = 0; idx < this.gridCount; idx++) {
                            this.centers[idx] = start - step * idx;
                        }
                    }
                    break;
                case LoopList_1.Movement.Vertical:
                    {
                        var step = this.content.width / this.gridCount;
                        var start = -this.content.width * 0.5 + step * 0.5;
                        for (var idx = 0; idx < this.gridCount; idx++) {
                            this.centers[idx] = start + step * idx;
                        }
                    }
                    break;
            }
        }
    };
    /// 重写创建逻辑
    LoopListGrid.prototype._updateHorizontal = function (idx, pos) {
        var curCount = this._items.length;
        /// recycle all items
        if (this._totalcount == 0) {
            curCount > 0 && this._recycleAllItems(true);
            return false;
        }
        /// fill up & fill down
        if (curCount == 0) {
            var item = this._createLeftItem(idx, pos);
            item.node.y = this.centers[0];
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
            // if( this._getItemLeft(rightItem) > (this.rightBoundary + this._maxPadding)) {
            if (leftItem.itemIdx > 0 && this._getItemLeft(rightItem) > (this.rightBoundary + this._maxPadding)) {
                this._items.splice(curCount - 1, 1);
                this._recycle(rightItem);
                return true;
            }
        }
        /// create left item
        if (this._getItemLeft(leftItem) > this.leftBoundary || (leftItem.itemIdx % this.gridCount) !== 0) {
            var item = this._createNewItem(leftItem.itemIdx - 1);
            if (item) {
                var c = item.itemIdx % this.gridCount;
                item.node.x = c !== (this.gridCount - 1) ? leftItem.node.x : leftItem.node.x - item.node.width - item.padding;
                item.node.y = this.centers[c];
                this._items.splice(0, 0, item);
                return true;
            }
        }
        /// create bottom item
        if (right_right < this.rightBoundary || (rightItem.itemIdx % this.gridCount) !== (this.gridCount - 1)) {
            var item = this._createNewItem(rightItem.itemIdx + 1);
            if (item) {
                var c = item.itemIdx % this.gridCount;
                item.node.x = c !== 0 ? rightItem.node.x : rightItem.node.x + rightItem.node.width + rightItem.padding;
                item.node.y = this.centers[c];
                this._items.push(item);
                return true;
            }
        }
        return false;
    };
    LoopListGrid.prototype._updateVertical = function (idx, pos) {
        var curCount = this._items.length;
        /// recycle all items
        if (this._totalcount == 0) {
            curCount > 0 && this._recycleAllItems(true);
            return false;
        }
        /// fill up & fill down
        if (curCount === 0) {
            var realidx = Math.floor(idx / this.gridCount); // idx % this.gridCount
            var item = this._createTopItem(realidx, pos);
            item.node.x = this.centers[0];
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
            /// recycle bottom item topitem.itemIdx > 0 &&
            if (topitem.itemIdx > 0 && this._getItemTop(bottomitem) < (this.bottomBoundary - this._maxPadding)) {
                // if( this._getItemTop( bottomitem) < (this.bottomBoundary - this._maxPadding)) {
                this._items.splice(curCount - 1, 1);
                this._recycle(bottomitem);
                return true;
            }
        }
        /// create top items
        if (this._getItemTop(topitem) < this.topBoundary || (topitem.itemIdx % this.gridCount) !== 0) {
            var item = this._createNewItem(topitem.itemIdx - 1);
            if (item) {
                var c = item.itemIdx % this.gridCount;
                item.node.y = c !== (this.gridCount - 1) ? topitem.node.y : topitem.node.y + item.padding + item.node.height;
                item.node.x = this.centers[c];
                this._items.splice(0, 0, item);
                return true;
            }
        }
        /// create bottom items
        if (bottom_bottom > this.bottomBoundary || (bottomitem.itemIdx % this.gridCount) !== (this.gridCount - 1)) {
            var item = this._createNewItem(bottomitem.itemIdx + 1);
            if (item) {
                var c = item.itemIdx % this.gridCount;
                item.node.y = c !== 0 ? bottomitem.node.y : bottomitem.node.y - bottomitem.node.height - bottomitem.padding;
                item.node.x = this.centers[c];
                this._items.push(item);
                return true;
            }
        }
        return false;
    };
    LoopListGrid.prototype._updateVerticalItems = function () {
        if (this._items.length > 1) {
            var pitem = this._items[0];
            for (var idx = 1; idx < this._items.length; idx++) {
                var item = this._items[idx];
                var c = item.itemIdx % this.gridCount;
                item.node.y = c !== 0 ? pitem.node.y : pitem.node.y - pitem.node.height - item.padding;
                item.node.x = this.centers[c];
                pitem = item;
            }
        }
    };
    LoopListGrid.prototype._updateHorizontalItems = function () {
        if (this._items.length > 1) {
            var preitem = this._items[0];
            for (var idx = 1; idx < this._items.length; idx++) {
                var item = this._items[idx];
                var c = item.itemIdx % this.gridCount;
                item.node.x = c !== 0 ? preitem.node.x : preitem.node.x + preitem.node.height + item.padding;
                item.node.y = this.centers[c];
                preitem = item;
            }
        }
    };
    __decorate([
        property(cc.Integer)
    ], LoopListGrid.prototype, "gridCount", void 0);
    LoopListGrid = __decorate([
        ccclass,
        disallowMultiple(),
        menu("UIExtension/LoopListGrid")
    ], LoopListGrid);
    return LoopListGrid;
}(LoopList_1.default));
exports.default = LoopListGrid;

cc._RF.pop();