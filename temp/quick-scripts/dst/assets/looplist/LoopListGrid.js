
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
        // console.log("item size dirty")
        // if( this._items.length > 1) {
        //     let pitem = this._items[0]
        //     for( let idx=1; idx < this._items.length; idx++){
        //         let item = this._items[idx]
        //         item.node.y = pitem.node.y - pitem.node.height - item.padding
        //         pitem = item
        //     }
        // }
    };
    LoopListGrid.prototype._updateHorizontalItems = function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdEdyaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFnRDtBQUUxQyxJQUFBLGtCQUEyRCxFQUExRCxvQkFBTyxFQUFFLHNCQUFRLEVBQUUsY0FBSSxFQUFFLHNDQUFpQyxDQUFDO0FBS2xFO0lBQTBDLGdDQUFRO0lBSGxEO1FBQUEscUVBd0tDO1FBbktHLCtDQUErQztRQUV2QyxlQUFTLEdBQVcsQ0FBQyxDQUFBO1FBRTdCLGtCQUFrQjtRQUNsQixhQUFPLEdBQWEsRUFBRSxDQUFDOztJQThKM0IsQ0FBQztJQTVKRyxjQUFjO0lBQ2QseUNBQWtCLEdBQWxCO1FBQ0ksaUJBQU0sa0JBQWtCLFdBQUUsQ0FBQTtRQUMxQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUM7WUFDYixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFBO1lBQ3BDLFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsS0FBSyxtQkFBUSxDQUFDLFVBQVU7b0JBQUM7d0JBQ3JCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7d0JBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUMsR0FBRyxDQUFBO3dCQUNoRCxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsRUFBQzs0QkFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFDLEdBQUcsQ0FBQTt5QkFDdkM7cUJBQ0o7b0JBQUMsTUFBTTtnQkFDUixLQUFLLG1CQUFRLENBQUMsUUFBUTtvQkFBRTt3QkFDcEIsSUFBSSxJQUFJLEdBQUcs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QUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFBO2dCQUN6RyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUMsQ0FBQTtnQkFDdkIsT0FBTyxJQUFJLENBQUE7YUFDZDtTQUNKO1FBQ0QsT0FBTyxLQUFLLENBQUE7SUFDaEIsQ0FBQztJQUVELDJDQUFvQixHQUFwQjtRQUNJLGlDQUFpQztRQUNqQyxnQ0FBZ0M7UUFDaEMsaUNBQWlDO1FBQ2pDLHdEQUF3RDtRQUN4RCxzQ0FBc0M7UUFDdEMsd0VBQXdFO1FBQ3hFLHVCQUF1QjtRQUN2QixRQUFRO1FBQ1IsSUFBSTtJQUNSLENBQUM7SUFFRCw2Q0FBc0IsR0FBdEI7SUFFQSxDQUFDO0lBaEtEO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7bURBQ087SUFKWixZQUFZO1FBSGhDLE9BQU87UUFDUCxnQkFBZ0IsRUFBRTtRQUNsQixJQUFJLENBQUMsMEJBQTBCLENBQUM7T0FDWixZQUFZLENBcUtoQztJQUFELG1CQUFDO0NBcktELEFBcUtDLENBckt5QyxrQkFBUSxHQXFLakQ7a0JBcktvQixZQUFZIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvb3BMaXN0LCB7IE1vdmVtZW50IH0gZnJvbSBcIi4vTG9vcExpc3RcIjtcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5LCBtZW51LCBkaXNhbGxvd011bHRpcGxlfSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5AZGlzYWxsb3dNdWx0aXBsZSgpXG5AbWVudShcIlVJRXh0ZW5zaW9uL0xvb3BMaXN0R3JpZFwiKVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vcExpc3RHcmlkIGV4dGVuZHMgTG9vcExpc3R7XG5cbiAgICAvLy8g5qC85a2Q5pWw6YePIOm7mOiupOS4ujIsIOWkp+S6jjLml7booajnpLrkuIDooYzmnInlpJrkuKrmiJbkuIDliJfmnInlpJrkuKog6YeH55SoIOW3puWIsOWPs+aIluS4iuWIsOS4i+aOkuWIl+aWueW8j1xuICAgIEBwcm9wZXJ0eSggY2MuSW50ZWdlcilcbiAgICBwcml2YXRlIGdyaWRDb3VudDogbnVtYmVyID0gMlxuICAgIFxuICAgIC8vLyBncmlkIGl0ZW0g5byA5aeL5L2N572uXG4gICAgY2VudGVyczogbnVtYmVyW10gPSBbXTtcblxuICAgIC8vLyDorqHnrpdncmlkIOeahOS4reW/g1xuICAgIF9jYWxjdWxhdGVCb3VuZGFyeSgpe1xuICAgICAgICBzdXBlci5fY2FsY3VsYXRlQm91bmRhcnkoKVxuICAgICAgICBpZiggdGhpcy5jb250ZW50KXtcbiAgICAgICAgICAgIHRoaXMuY2VudGVycy5sZW5ndGggPSB0aGlzLmdyaWRDb3VudFxuICAgICAgICAgICAgc3dpdGNoKCB0aGlzLm1vdmVtZW50KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5Ib3Jpem9udGFsOntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ZXAgPSB0aGlzLmNvbnRlbnQuaGVpZ2h0IC8gdGhpcy5ncmlkQ291bnRcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5jb250ZW50LmhlaWdodCAqIDAuNSAtIHN0ZXAqMC41XG4gICAgICAgICAgICAgICAgICAgIGZvciggbGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMuZ3JpZENvdW50OyBpZHgrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbnRlcnNbaWR4XSA9IHN0YXJ0IC0gc3RlcCppZHhcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBNb3ZlbWVudC5WZXJ0aWNhbDoge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RlcCA9IHRoaXMuY29udGVudC53aWR0aCAvIHRoaXMuZ3JpZENvdW50XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IC10aGlzLmNvbnRlbnQud2lkdGggKiAwLjUgKyBzdGVwKjAuNVxuICAgICAgICAgICAgICAgICAgICBmb3IoIGxldCBpZHggPSAwOyBpZHggPCB0aGlzLmdyaWRDb3VudDsgaWR4Kyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZW50ZXJzW2lkeF0gPSBzdGFydCArIHN0ZXAqaWR4XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8vIOmHjeWGmeWIm+W7uumAu+i+kVxuICAgIHByb3RlY3RlZCBfdXBkYXRlSG9yaXpvbnRhbCggaWR4OiBudW1iZXIsIHBvczogbnVtYmVyKSB7XG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxuICAgICAgICAvLy8gcmVjeWNsZSBhbGwgaXRlbXNcbiAgICAgICAgaWYoIHRoaXMuX3RvdGFsY291bnQgPT0gMCkge1xuICAgICAgICAgICAgY3VyQ291bnQgPiAwICYmIHRoaXMuX3JlY3ljbGVBbGxJdGVtcyggdHJ1ZSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIC8vLyBmaWxsIHVwICYgZmlsbCBkb3duXG4gICAgICAgIGlmKCBjdXJDb3VudCA9PSAwKSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZUxlZnRJdGVtKCBpZHgsIHBvcylcbiAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gdGhpcy5jZW50ZXJzWzBdXG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPSBudWxsPyB0cnVlOiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIC8vLyBmaWxsIGxlZnQgJiBmaWxsIHJpZ2h0XG4gICAgICAgIGxldCBsZWZ0SXRlbSA9IHRoaXMuX2l0ZW1zWzBdXG4gICAgICAgIGxldCByaWdodEl0ZW0gPSB0aGlzLl9pdGVtc1sgY3VyQ291bnQtMV1cbiAgICAgICAgbGV0IHJpZ2h0X3JpZ2h0ID0gdGhpcy5fZ2V0SXRlbVJpZ2h0KCByaWdodEl0ZW0pXG4gICAgICAgIGlmKCBjdXJDb3VudCA+IDEpIHtcbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIGxlZnQgaXRlbVxuICAgICAgICAgICAgbGV0IGNhblJlY3ljbGVMZWZ0ID0gKHJpZ2h0SXRlbS5pdGVtSWR4ICE9PSAodGhpcy5fdG90YWxjb3VudCAtIDEpIHx8IHJpZ2h0X3JpZ2h0ID4gdGhpcy5yaWdodEJvdW5kYXJ5KVxuICAgICAgICAgICAgaWYoIGNhblJlY3ljbGVMZWZ0ICYmIHRoaXMuX2dldEl0ZW1SaWdodCggbGVmdEl0ZW0pIDwgKHRoaXMubGVmdEJvdW5kYXJ5IC0gdGhpcy5fbWF4UGFkZGluZykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDEpXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggbGVmdEl0ZW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vLyByZWN5Y2xlIHJpZ2h0IGl0ZW1cbiAgICAgICAgICAgIGlmKCBsZWZ0SXRlbS5pdGVtSWR4ID4gMCAmJiB0aGlzLl9nZXRJdGVtTGVmdChyaWdodEl0ZW0pID4gKHRoaXMucmlnaHRCb3VuZGFyeSArIHRoaXMuX21heFBhZGRpbmcpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCBjdXJDb3VudC0xLCAxKVxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3ljbGUoIHJpZ2h0SXRlbSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vLyBjcmVhdGUgbGVmdCBpdGVtXG4gICAgICAgIGlmKCB0aGlzLl9nZXRJdGVtTGVmdCggbGVmdEl0ZW0pID4gdGhpcy5sZWZ0Qm91bmRhcnkgfHwgKGxlZnRJdGVtLml0ZW1JZHgldGhpcy5ncmlkQ291bnQpICE9PSAwKSB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZU5ld0l0ZW0oIGxlZnRJdGVtLml0ZW1JZHggLSAxKVxuICAgICAgICAgICAgaWYoIGl0ZW0pIHtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IGl0ZW0uaXRlbUlkeCAlIHRoaXMuZ3JpZENvdW50XG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSBjICE9PSAodGhpcy5ncmlkQ291bnQtMSk/IGxlZnRJdGVtLm5vZGUueDogbGVmdEl0ZW0ubm9kZS54IC0gaXRlbS5ub2RlLndpZHRoIC0gaXRlbS5wYWRkaW5nIFxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gdGhpcy5jZW50ZXJzW2NdXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMuc3BsaWNlKCAwLCAwLCBpdGVtKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8vIGNyZWF0ZSBib3R0b20gaXRlbVxuICAgICAgICBpZiggcmlnaHRfcmlnaHQgPCB0aGlzLnJpZ2h0Qm91bmRhcnkgfHwgKHJpZ2h0SXRlbS5pdGVtSWR4JXRoaXMuZ3JpZENvdW50ICkgIT09ICh0aGlzLmdyaWRDb3VudC0xKSkge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jcmVhdGVOZXdJdGVtKCByaWdodEl0ZW0uaXRlbUlkeCArIDEpXG4gICAgICAgICAgICBpZiggaXRlbSkge1xuICAgICAgICAgICAgICAgIGxldCBjID0gaXRlbS5pdGVtSWR4ICUgdGhpcy5ncmlkQ291bnRcbiAgICAgICAgICAgICAgICBpdGVtLm5vZGUueCA9IGMgIT09IDA/IHJpZ2h0SXRlbS5ub2RlLng6IHJpZ2h0SXRlbS5ub2RlLnggKyByaWdodEl0ZW0ubm9kZS53aWR0aCArIHJpZ2h0SXRlbS5wYWRkaW5nXG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnkgPSB0aGlzLmNlbnRlcnNbY11cbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5wdXNoKCBpdGVtKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIF91cGRhdGVWZXJ0aWNhbCggaWR4OiBudW1iZXIsIHBvczogbnVtYmVyKSB7XG4gICAgICAgIGxldCBjdXJDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aFxuICAgICAgICAvLy8gcmVjeWNsZSBhbGwgaXRlbXNcbiAgICAgICAgaWYoIHRoaXMuX3RvdGFsY291bnQgPT0gMCApIHtcbiAgICAgICAgICAgIGN1ckNvdW50ID4gMCAmJiB0aGlzLl9yZWN5Y2xlQWxsSXRlbXMoIHRydWUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgICAvLy8gZmlsbCB1cCAmIGZpbGwgZG93blxuICAgICAgICBpZiggY3VyQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGxldCByZWFsaWR4ID0gTWF0aC5mbG9vcihpZHgvdGhpcy5ncmlkQ291bnQpIC8vIGlkeCAlIHRoaXMuZ3JpZENvdW50XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NyZWF0ZVRvcEl0ZW0oIHJlYWxpZHgsIHBvcylcbiAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gdGhpcy5jZW50ZXJzWzBdXG4gICAgICAgICAgICByZXR1cm4gaXRlbSAhPSBudWxsXG4gICAgICAgIH1cbiAgICAgICAgLy8vIHJlY3ljbGUgdG9wIGl0ZW0g5Zue5pS26aG26YOo5pWw5o2uIOWmguaenOacgOW6leS4i+eahGl0ZW0g5piv5pyA5ZCO5LiA5p2h6YKj5LmI5LiN5Zue5pS25LiK6Z2i55qEaXRlbVxuICAgICAgICBsZXQgdG9waXRlbSA9IHRoaXMuX2l0ZW1zWzBdXG4gICAgICAgIGxldCBib3R0b21pdGVtID0gdGhpcy5faXRlbXNbIGN1ckNvdW50LTFdXG4gICAgICAgIGxldCBib3R0b21fYm90dG9tID0gdGhpcy5fZ2V0SXRlbUJvdHRvbSggYm90dG9taXRlbSlcbiAgICAgICAgaWYoIGN1ckNvdW50ID4gMSkge1xuICAgICAgICAgICAgLy8vIHJlY3ljbGUgdG9wIGl0ZW1cbiAgICAgICAgICAgIGxldCBjYW5SZWN5Y2xlVG9wID0gKGJvdHRvbWl0ZW0uaXRlbUlkeCAhPT0gdGhpcy5fdG90YWxjb3VudC0xIHx8IGJvdHRvbV9ib3R0b20gPCB0aGlzLl9ib3R0b21Cb3VuZGFyeSlcbiAgICAgICAgICAgIGlmKCBjYW5SZWN5Y2xlVG9wICYmIHRoaXMuX2dldEl0ZW1Cb3R0b20oIHRvcGl0ZW0pID4gKHRoaXMudG9wQm91bmRhcnkgKyB0aGlzLl9tYXhQYWRkaW5nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2l0ZW1zLnNwbGljZSggMCwgMSlcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWN5Y2xlKCB0b3BpdGVtKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLy8gcmVjeWNsZSBib3R0b20gaXRlbSB0b3BpdGVtLml0ZW1JZHggPiAwICYmXG4gICAgICAgICAgICAvLyBpZiggdG9waXRlbS5pdGVtSWR4ID4gMCAmJiB0aGlzLl9nZXRJdGVtVG9wKCBib3R0b21pdGVtKSA8ICh0aGlzLmJvdHRvbUJvdW5kYXJ5IC0gdGhpcy5fbWF4UGFkZGluZykpIHtcbiAgICAgICAgICAgIGlmKCB0aGlzLl9nZXRJdGVtVG9wKCBib3R0b21pdGVtKSA8ICh0aGlzLmJvdHRvbUJvdW5kYXJ5IC0gdGhpcy5fbWF4UGFkZGluZykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIGN1ckNvdW50LTEsIDEpXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjeWNsZSggYm90dG9taXRlbSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vLyBjcmVhdGUgdG9wIGl0ZW1zXG4gICAgICAgIGlmKCB0aGlzLl9nZXRJdGVtVG9wKCB0b3BpdGVtKSA8IHRoaXMudG9wQm91bmRhcnkgfHwgKHRvcGl0ZW0uaXRlbUlkeCV0aGlzLmdyaWRDb3VudCkgIT09IDApIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggdG9waXRlbS5pdGVtSWR4IC0gMSlcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSBpdGVtLml0ZW1JZHggJSB0aGlzLmdyaWRDb3VudFxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gYyAhPT0gKHRoaXMuZ3JpZENvdW50LTEpPyB0b3BpdGVtLm5vZGUueTogdG9waXRlbS5ub2RlLnkgKyBpdGVtLnBhZGRpbmcgKyBpdGVtLm5vZGUuaGVpZ2h0XG4gICAgICAgICAgICAgICAgaXRlbS5ub2RlLnggPSB0aGlzLmNlbnRlcnNbY11cbiAgICAgICAgICAgICAgICB0aGlzLl9pdGVtcy5zcGxpY2UoIDAsIDAsIGl0ZW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLy8gY3JlYXRlIGJvdHRvbSBpdGVtc1xuICAgICAgICBpZiggYm90dG9tX2JvdHRvbSA+IHRoaXMuYm90dG9tQm91bmRhcnkgfHwgKGJvdHRvbWl0ZW0uaXRlbUlkeCV0aGlzLmdyaWRDb3VudCApICE9PSAodGhpcy5ncmlkQ291bnQtMSkpIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fY3JlYXRlTmV3SXRlbSggYm90dG9taXRlbS5pdGVtSWR4ICsgMSlcbiAgICAgICAgICAgIGlmKCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgbGV0IGMgPSBpdGVtLml0ZW1JZHggJSB0aGlzLmdyaWRDb3VudFxuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS55ID0gYyAhPT0gMD8gYm90dG9taXRlbS5ub2RlLnk6IGJvdHRvbWl0ZW0ubm9kZS55IC0gYm90dG9taXRlbS5ub2RlLmhlaWdodCAtIGJvdHRvbWl0ZW0ucGFkZGluZ1xuICAgICAgICAgICAgICAgIGl0ZW0ubm9kZS54ID0gdGhpcy5jZW50ZXJzW2NdXG4gICAgICAgICAgICAgICAgdGhpcy5faXRlbXMucHVzaCggaXRlbSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIF91cGRhdGVWZXJ0aWNhbEl0ZW1zKCl7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaXRlbSBzaXplIGRpcnR5XCIpXG4gICAgICAgIC8vIGlmKCB0aGlzLl9pdGVtcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vICAgICBsZXQgcGl0ZW0gPSB0aGlzLl9pdGVtc1swXVxuICAgICAgICAvLyAgICAgZm9yKCBsZXQgaWR4PTE7IGlkeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgaWR4Kyspe1xuICAgICAgICAvLyAgICAgICAgIGxldCBpdGVtID0gdGhpcy5faXRlbXNbaWR4XVxuICAgICAgICAvLyAgICAgICAgIGl0ZW0ubm9kZS55ID0gcGl0ZW0ubm9kZS55IC0gcGl0ZW0ubm9kZS5oZWlnaHQgLSBpdGVtLnBhZGRpbmdcbiAgICAgICAgLy8gICAgICAgICBwaXRlbSA9IGl0ZW1cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgIH1cblxuICAgIF91cGRhdGVIb3Jpem9udGFsSXRlbXMoKXtcbiAgICAgICAgXG4gICAgfVxufSJdfQ==