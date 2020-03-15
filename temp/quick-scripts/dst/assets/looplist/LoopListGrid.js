
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/looplist/LoopListGrid.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
    LoopListGrid.prototype.start = function () {
        this._itemSizeDirty = true;
    };
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
            // if( topitem.itemIdx > 0 && this._getItemTop( bottomitem) < (this.bottomBoundary - this._maxPadding)) {
            if (this._getItemTop(bottomitem) < (this.bottomBoundary - this._maxPadding)) {
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
        console.log("_updateVerticalItems");
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
        console.log("_updateHorizontalItems");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdEdyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFnRDtBQUUxQyxJQUFBLGtCQUEyRCxFQUExRCxvQkFBTyxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLHNDQUFpQyxDQUFDO0FBS2xFO0lBQTBDLGdDQUFRO0lBSGxEO1FBQUEscUVBd0xDO1FBbkxHLCtDQUErQztRQUV2QyxlQUFTLEdBQVcsQ0FBQyxDQUFBO1FBRTdCLGtCQUFrQjtRQUNsQixhQUFPLEdBQWEsRUFBRSxDQUFDOztJQThLM0IsQ0FBQztJQTVLRyw0QkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUE7SUFDOUIsQ0FBQztJQUVELGNBQWM7SUFDZCx5Q0FBa0IsR0FBbEI7UUFDSSxpQkFBTSxrQkFBa0IsV0FBRSxDQUFBO1FBQzFCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBQztZQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7WUFDcEMsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNuQixLQUFLLG1CQUFRLENBQUMsVUFBVTtvQkFBQzt3QkFDckIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQTt3QkFDL0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBQyxHQUFHLENBQUE7d0JBQ2hELEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxFQUFDOzRCQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUMsR0FBRyxDQUFBO3lCQUN2QztxQkFDSjtvQkFB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QUE7Z0JBQzdCLE9BQU8sR0FBRyxJQUFJLENBQUE7YUFDakI7U0FDSjtJQUNMLENBQUM7SUFoTEQ7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQzttREFDTztJQUpaLFlBQVk7UUFIaEMsT0FBTztRQUNQLGdCQUFnQixFQUFFO1FBQ2xCLElBQUksQ0FBQywwQkFBMEIsQ0FBQztPQUNaLFlBQVksQ0FxTGhDO0lBQUQsbUJBQUM7Q0FyTEQsQUFxTEMsQ0FyTHlDLGtCQUFRLEdBcUxqRDtrQkFyTG9CLFlBQVkiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9vcExpc3QsIHsgTW92ZW1lbnQgfSBmcm9tIFwiLi9Mb29wTGlzdFwiO1xuXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHksIG1lbnUsIGRpc2FsbG93TXVsdGlwbGV9ID0gY2MuX2RlY29yYXRvcjtcblxuQGNjY2xhc3NcbkBkaXNhbGxvd011bHRpcGxlKClcbkBtZW51KFwiVUlFeHRlbnNpb24vTG9vcExpc3RHcmlkXCIpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb29wTGlzdEdyaWQgZXh0ZW5kcyBMb29wTGlzdHtcblxuICAgIC8vLyDmoLzlrZDmlbDph48g6buY6K6k5Li6Miwg5aSn5LqOMuaXtuihqOekuuS4gOihjOacieWkmuS4quaIluS4gOWIl+acieWkmuS4qiDph4fnlKgg5bem5Yiw5Y+z5oiW5LiK5Yiw5LiL5o6S5YiX5pa55byPXG4gICAgQHByb3BlcnR5KCBjYy5JbnRlZ2VyKVxuICAgIHByaXZhdGUgZ3JpZENvdW50OiBudW1iZXIgPSAyXG4gICAgXG4gICAgLy8vIGdyaWQgaXRlbSDlvIDlp4vkvY3nva5cbiAgICBjZW50ZXJzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgc3RhcnQoKXtcbiAgICAgICAgdGhpcy5faXRlbVNpemVEaXJ0eSA9IHRydWVcbiAgICB9XG5cbiAgICAvLy8g6K6h566XZ3JpZCDnmoTkuK3lv4NcbiAgICBfY2FsY3VsYXRlQm91bmRhcnkoKXtcbiAgICAgICAgc3VwZXIuX2NhbGN1bGF0ZUJvdW5kYXJ5KClcbiAgICAgICAgaWYoIHRoaXMuY29udGVudCl7XG4gICAgICAgICAgICB0aGlzLmNlbnRlcnMubGVuZ3RoID0gdGhpcy5ncmlkQ291bnRcbiAgICAgICAgICAgIHN3aXRjaCggdGhpcy5tb3ZlbWVudCkge1xuICAgICAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuSG9yaXpvbnRhbDp7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGVwID0gdGhpcy5jb250ZW50LmhlaWdodCAvIHRoaXMuZ3JpZENvdW50XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IHRoaXMuY29udGVudC5oZWlnaHQgKiAwLjUgLSBzdGVwKjAuNVxuICAgICAgICAgICAgICAgICAgICBmb3IoIGxldCBpZHggPSAwOyBpZHggPCB0aGlzLmdyaWRDb3VudDsgaWR4Kyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXJzW2lkeF0gPSBzdGFydCAtIHN0ZXAqaWR4XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW92ZW1lbnQuVmVydGljYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ZXAgPSB0aGlzLmNvbnRlbnQud2lkdGggLyB0aGlzLmdyaWRDb3VudFxuICAgICAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSAtdGhpcy5jb250ZW50LndpZHRoICogMC41ICsgc3RlcCowLjVcbiAgICAgICAgICAgICAgICAgICAgZm9yKCBsZXQgaWR4ID0gMDsgaWR4IDwgdGhpcy5ncmlkQ291bnQ7IGlkeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyc1tpZHhdID0gc3RhcnQgKyBzdGVwKmlkeFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vLyDph43lhpnliJvlu7rpgLvovpFcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZUhvcml6b250YWwoIGlkeDogbnVtYmVyLCBwb3M6IG51bWJlcikge1xuICAgICAgICBsZXQgY3VyQ291bnQgPSB0aGlzLl9pdGVtcy5sZW5ndGhcbiAgICAgICAgLy8vIHJlY3ljbGUgYWxsIGl0ZW1zXG4gICAgICAgIGlmKCB0aGlzLl90b3RhbGNvdW50ID09IDApIHtcbiAgICAgICAgICAgIGN1ckNvdW50ID4gMCAmJiB0aGlzLl9yZWN5Y2xlQWxsSXRlbXMoIHRydWUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICAvLy8gZmlsbCB1cCAmIGZpbGwgZG93blxuICAgICAgICBpZiggY3VyQ291bnQgPT0gMCkge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVMZWZ0SXRlbSggaWR4LCBwb3MpXG4gICAgICAgICAgICBpdGVtLm5vZGUueSA9IHRoaXMuY2VudGVyc1swXVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT0gbnVsbD8gdHJ1ZTogZmFsc2VcbiAgICAgICAgfVxuICAgICAgICAvLy8gZmlsbCBsZWZ0ICYgZmlsbCByaWdodFxuICAgICAgICBsZXQgbGVmdEl0ZW0gPSB0aGlzLl9pdGVtc1swXVxuICAgICAgICBsZXQgcmlnaHRJdGVtID0gdGhpcy5faXRlbXNbIGN1ckNvdW50LTFdXG4gICAgICAgIGxldCByaWdodF9yaWdodCA9IHRoaXMuX2dldEl0ZW1SaWdodCggcmlnaHRJdGVtKVxuICAgICAgICBpZiggY3VyQ291bnQgPiAxKSB7XG4gICAgICAgICAgICAvLy8gcmVjeWNsZSBsZWZ0IGl0ZW1cbiAgICAgICAgICAgIGxldCBjYW5SZWN5Y2xlTGVmdCA9IChyaWdodEl0ZW0uaXRlbUlkeCAhPT0gKHRoaXMuX3RvdGFsY291bnQgLSAxKSB8fCByaWdodF9yaWdodCA+IHRoaXMucmlnaHRCb3VuZGFyeSlcbiAgICAgICAgICAgIGlmKCBjYW5SZWN5Y2xlTGVmdCAmJiB0aGlzLl9nZXRJdGVtUmlnaHQoIGxlZnRJdGVtKSA8ICh0aGlzLmxlZnRCb3VuZGFyeSAtIHRoaXMuX21heFBhZGRpbmcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAxKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIGxlZnRJdGVtKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLy8gcmVjeWNsZSByaWdodCBpdGVtXG4gICAgICAgICAgICBpZiggbGVmdEl0ZW0uaXRlbUlkeCA+IDAgJiYgdGhpcy5fZ2V0SXRlbUxlZnQocmlnaHRJdGVtKSA+ICh0aGlzLnJpZ2h0Qm91bmRhcnkgKyB0aGlzLl9tYXhQYWRkaW5nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggY3VyQ291bnQtMSwgMSlcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCByaWdodEl0ZW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLy8gY3JlYXRlIGxlZnQgaXRlbVxuICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbUxlZnQoIGxlZnRJdGVtKSA+IHRoaXMubGVmdEJvdW5kYXJ5IHx8IChsZWZ0SXRlbS5pdGVtSWR4JXRoaXMuZ3JpZENvdW50KSAhPT0gMCkge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCBsZWZ0SXRlbS5pdGVtSWR4IC0gMSlcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSBpdGVtLml0ZW1JZHggJSB0aGlzLmdyaWRDb3VudFxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gYyAhPT0gKHRoaXMuZ3JpZENvdW50LTEpPyBsZWZ0SXRlbS5ub2RlLng6IGxlZnRJdGVtLm5vZGUueCAtIGl0ZW0ubm9kZS53aWR0aCAtIGl0ZW0ucGFkZGluZyBcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHRoaXMuY2VudGVyc1tjXVxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMCwgaXRlbSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vLyBjcmVhdGUgYm90dG9tIGl0ZW1cbiAgICAgICAgaWYoIHJpZ2h0X3JpZ2h0IDwgdGhpcy5yaWdodEJvdW5kYXJ5IHx8IChyaWdodEl0ZW0uaXRlbUlkeCV0aGlzLmdyaWRDb3VudCApICE9PSAodGhpcy5ncmlkQ291bnQtMSkpIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggcmlnaHRJdGVtLml0ZW1JZHggKyAxKVxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IGl0ZW0uaXRlbUlkeCAlIHRoaXMuZ3JpZENvdW50XG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSBjICE9PSAwPyByaWdodEl0ZW0ubm9kZS54OiByaWdodEl0ZW0ubm9kZS54ICsgcmlnaHRJdGVtLm5vZGUud2lkdGggKyByaWdodEl0ZW0ucGFkZGluZ1xuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gdGhpcy5jZW50ZXJzW2NdXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBfdXBkYXRlVmVydGljYWwoIGlkeDogbnVtYmVyLCBwb3M6IG51bWJlcikge1xuICAgICAgICBsZXQgY3VyQ291bnQgPSB0aGlzLl9pdGVtcy5sZW5ndGhcbiAgICAgICAgLy8vIHJlY3ljbGUgYWxsIGl0ZW1zXG4gICAgICAgIGlmKCB0aGlzLl90b3RhbGNvdW50ID09IDAgKSB7XG4gICAgICAgICAgICBjdXJDb3VudCA+IDAgJiYgdGhpcy5fcmVjeWNsZUFsbEl0ZW1zKCB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgLy8vIGZpbGwgdXAgJiBmaWxsIGRvd25cbiAgICAgICAgaWYoIGN1ckNvdW50ID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgcmVhbGlkeCA9IE1hdGguZmxvb3IoaWR4L3RoaXMuZ3JpZENvdW50KSAvLyBpZHggJSB0aGlzLmdyaWRDb3VudFxuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVUb3BJdGVtKCByZWFsaWR4LCBwb3MpXG4gICAgICAgICAgICBpdGVtLm5vZGUueCA9IHRoaXMuY2VudGVyc1swXVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gIT0gbnVsbFxuICAgICAgICB9XG4gICAgICAgIC8vLyByZWN5Y2xlIHRvcCBpdGVtIOWbnuaUtumhtumDqOaVsOaNriDlpoLmnpzmnIDlupXkuIvnmoRpdGVtIOaYr+acgOWQjuS4gOadoemCo+S5iOS4jeWbnuaUtuS4iumdoueahGl0ZW1cbiAgICAgICAgbGV0IHRvcGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxuICAgICAgICBsZXQgYm90dG9taXRlbSA9IHRoaXMuX2l0ZW1zWyBjdXJDb3VudC0xXVxuICAgICAgICBsZXQgYm90dG9tX2JvdHRvbSA9IHRoaXMuX2dldEl0ZW1Cb3R0b20oIGJvdHRvbWl0ZW0pXG4gICAgICAgIGlmKCBjdXJDb3VudCA+IDEpIHtcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHRvcCBpdGVtXG4gICAgICAgICAgICBsZXQgY2FuUmVjeWNsZVRvcCA9IChib3R0b21pdGVtLml0ZW1JZHggIT09IHRoaXMuX3RvdGFsY291bnQtMSB8fCBib3R0b21fYm90dG9tIDwgdGhpcy5fYm90dG9tQm91bmRhcnkpXG4gICAgICAgICAgICBpZiggY2FuUmVjeWNsZVRvcCAmJiB0aGlzLl9nZXRJdGVtQm90dG9tKCB0b3BpdGVtKSA+ICh0aGlzLnRvcEJvdW5kYXJ5ICsgdGhpcy5fbWF4UGFkZGluZykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDEpXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggdG9waXRlbSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8vIHJlY3ljbGUgYm90dG9tIGl0ZW0gdG9waXRlbS5pdGVtSWR4ID4gMCAmJlxuICAgICAgICAgICAgLy8gaWYoIHRvcGl0ZW0uaXRlbUlkeCA+IDAgJiYgdGhpcy5fZ2V0SXRlbVRvcCggYm90dG9taXRlbSkgPCAodGhpcy5ib3R0b21Cb3VuZGFyeSAtIHRoaXMuX21heFBhZGRpbmcpKSB7XG4gICAgICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbVRvcCggYm90dG9taXRlbSkgPCAodGhpcy5ib3R0b21Cb3VuZGFyeSAtIHRoaXMuX21heFBhZGRpbmcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCBjdXJDb3VudC0xLCAxKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIGJvdHRvbWl0ZW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLy8gY3JlYXRlIHRvcCBpdGVtc1xuICAgICAgICBpZiggdGhpcy5fZ2V0SXRlbVRvcCggdG9waXRlbSkgPCB0aGlzLnRvcEJvdW5kYXJ5IHx8ICh0b3BpdGVtLml0ZW1JZHgldGhpcy5ncmlkQ291bnQpICE9PSAwKSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIHRvcGl0ZW0uaXRlbUlkeCAtIDEpXG4gICAgICAgICAgICBpZiggaXRlbSkge1xuICAgICAgICAgICAgICAgIGxldCBjID0gaXRlbS5pdGVtSWR4ICUgdGhpcy5ncmlkQ291bnRcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IGMgIT09ICh0aGlzLmdyaWRDb3VudC0xKT8gdG9waXRlbS5ub2RlLnk6IHRvcGl0ZW0ubm9kZS55ICsgaXRlbS5wYWRkaW5nICsgaXRlbS5ub2RlLmhlaWdodFxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gdGhpcy5jZW50ZXJzW2NdXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAwLCBpdGVtKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbXNcbiAgICAgICAgaWYoIGJvdHRvbV9ib3R0b20gPiB0aGlzLmJvdHRvbUJvdW5kYXJ5IHx8IChib3R0b21pdGVtLml0ZW1JZHgldGhpcy5ncmlkQ291bnQgKSAhPT0gKHRoaXMuZ3JpZENvdW50LTEpKSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIGJvdHRvbWl0ZW0uaXRlbUlkeCArIDEpXG4gICAgICAgICAgICBpZiggaXRlbSkge1xuICAgICAgICAgICAgICAgIGxldCBjID0gaXRlbS5pdGVtSWR4ICUgdGhpcy5ncmlkQ291bnRcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IGMgIT09IDA/IGJvdHRvbWl0ZW0ubm9kZS55OiBib3R0b21pdGVtLm5vZGUueSAtIGJvdHRvbWl0ZW0ubm9kZS5oZWlnaHQgLSBib3R0b21pdGVtLnBhZGRpbmdcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IHRoaXMuY2VudGVyc1tjXVxuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goIGl0ZW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBfdXBkYXRlVmVydGljYWxJdGVtcygpe1xuICAgICAgICBjb25zb2xlLmxvZyggXCJfdXBkYXRlVmVydGljYWxJdGVtc1wiKVxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IHBpdGVtID0gdGhpcy5faXRlbXNbMF1cbiAgICAgICAgICAgIGZvciggbGV0IGlkeD0xOyBpZHggPCB0aGlzLl9pdGVtcy5sZW5ndGg7IGlkeCsrKXtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2l0ZW1zW2lkeF1cbiAgICAgICAgICAgICAgICBsZXQgYyA9IGl0ZW0uaXRlbUlkeCAlIHRoaXMuZ3JpZENvdW50XG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSBjICE9PSAwPyBwaXRlbS5ub2RlLnk6IHBpdGVtLm5vZGUueSAtIHBpdGVtLm5vZGUuaGVpZ2h0IC0gaXRlbS5wYWRkaW5nXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSB0aGlzLmNlbnRlcnNbY11cbiAgICAgICAgICAgICAgICBwaXRlbSA9IGl0ZW1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF91cGRhdGVIb3Jpem9udGFsSXRlbXMoKXtcbiAgICAgICAgY29uc29sZS5sb2coIFwiX3VwZGF0ZUhvcml6b250YWxJdGVtc1wiKVxuICAgICAgICBpZiggdGhpcy5faXRlbXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IHByZWl0ZW0gPSB0aGlzLl9pdGVtc1swXVxuICAgICAgICAgICAgZm9yKCBsZXQgaWR4PTE7IGlkeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgaWR4Kyspe1xuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbaWR4XVxuICAgICAgICAgICAgICAgIGxldCBjID0gaXRlbS5pdGVtSWR4ICUgdGhpcy5ncmlkQ291bnRcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IGMgIT09IDA/IHByZWl0ZW0ubm9kZS54OiBwcmVpdGVtLm5vZGUueCArIHByZWl0ZW0ubm9kZS5oZWlnaHQgKyBpdGVtLnBhZGRpbmdcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueSA9IHRoaXMuY2VudGVyc1tjXVxuICAgICAgICAgICAgICAgIHByZWl0ZW0gPSBpdGVtXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59Il19