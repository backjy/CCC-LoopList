
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/looplist/LoopListItem.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '7392bBLh4NAwLoZSiKHSTnO', 'LoopListItem');
// looplist/LoopListItem.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var LoopListItem = /** @class */ (function (_super) {
    __extends(LoopListItem, _super);
    function LoopListItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /// item start offset
        _this.startOffset = 0;
        /// item padding
        _this.padding = 0;
        /// item cache key
        _this.itemKey = null;
        /// record item offset 
        _this._offset = 0;
        /// item index
        _this._idx = -1;
        /// current loop list
        _this.looplist = null;
        return _this;
    }
    Object.defineProperty(LoopListItem.prototype, "offset", {
        get: function () { return this._offset; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoopListItem.prototype, "itemIdx", {
        get: function () { return this._idx; },
        set: function (value) {
            /// set idx 的时候直接设置好对应的 offset 避免get 的时候再做if 判断
            this._offset = (value === 0) ? this.startOffset : 0;
            this._idx = value;
        },
        enumerable: true,
        configurable: true
    });
    LoopListItem.prototype.onEnable = function () { this.node.on(cc.Node.EventType.SIZE_CHANGED, this.onSizeChanged, this); };
    LoopListItem.prototype.onDisable = function () { this.node.off(cc.Node.EventType.SIZE_CHANGED, this.onSizeChanged, this); };
    LoopListItem.prototype.onSizeChanged = function () {
        if (this.looplist) {
            this.looplist.itemSizeChanged();
        }
    };
    __decorate([
        property(cc.Float)
    ], LoopListItem.prototype, "startOffset", void 0);
    __decorate([
        property(cc.Float)
    ], LoopListItem.prototype, "padding", void 0);
    LoopListItem = __decorate([
        ccclass
    ], LoopListItem);
    return LoopListItem;
}(cc.Component));
exports.default = LoopListItem;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVNLElBQUEsa0JBQW1DLEVBQWxDLG9CQUFPLEVBQUUsc0JBQXlCLENBQUM7QUFHMUM7SUFBMEMsZ0NBQVk7SUFEdEQ7UUFBQSxxRUFnQ0M7UUE5QkcscUJBQXFCO1FBRWIsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDL0IsZ0JBQWdCO1FBRWhCLGFBQU8sR0FBVyxDQUFDLENBQUE7UUFDbkIsa0JBQWtCO1FBQ1gsYUFBTyxHQUFXLElBQUksQ0FBQTtRQUM3Qix1QkFBdUI7UUFDZixhQUFPLEdBQVcsQ0FBQyxDQUFBO1FBRTNCLGNBQWM7UUFDTixVQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUE7UUFRekIscUJBQXFCO1FBQ3JCLGNBQVEsR0FBYSxJQUFJLENBQUE7O0lBUzdCLENBQUM7SUFwQkcsc0JBQUksZ0NBQU07YUFBVixjQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7OztPQUFBO0lBR25DLHNCQUFJLGlDQUFPO2FBS1gsY0FBZ0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBLENBQUEsQ0FBQzthQUxqQyxVQUFhLEtBQWE7WUFDdEIsK0NBQStDO1lBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtRQUNyQixDQUFDOzs7T0FBQTtJQU1ELCtCQUFRLEdBQVIsY0FBYSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFdEYsZ0NBQVMsR0FBVCxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVoRixvQ0FBYSxHQUFyQjtRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7U0FBRTtJQUMzRCxDQUFDO0lBM0JEO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7cURBQ1c7SUFHL0I7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztpREFDRDtJQU5GLFlBQVk7UUFEaEMsT0FBTztPQUNhLFlBQVksQ0ErQmhDO0lBQUQsbUJBQUM7Q0EvQkQsQUErQkMsQ0EvQnlDLEVBQUUsQ0FBQyxTQUFTLEdBK0JyRDtrQkEvQm9CLFlBQVkiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9vcExpc3QgZnJvbSBcIi4vTG9vcExpc3RcIjtcclxuXHJcbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eX0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuQGNjY2xhc3NcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vcExpc3RJdGVtIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcclxuICAgIC8vLyBpdGVtIHN0YXJ0IG9mZnNldFxyXG4gICAgQHByb3BlcnR5KCBjYy5GbG9hdClcclxuICAgIHByaXZhdGUgc3RhcnRPZmZzZXQ6IG51bWJlciA9IDBcclxuICAgIC8vLyBpdGVtIHBhZGRpbmdcclxuICAgIEBwcm9wZXJ0eSggY2MuRmxvYXQpXHJcbiAgICBwYWRkaW5nOiBudW1iZXIgPSAwXHJcbiAgICAvLy8gaXRlbSBjYWNoZSBrZXlcclxuICAgIHB1YmxpYyBpdGVtS2V5OiBzdHJpbmcgPSBudWxsXHJcbiAgICAvLy8gcmVjb3JkIGl0ZW0gb2Zmc2V0IFxyXG4gICAgcHJpdmF0ZSBfb2Zmc2V0OiBudW1iZXIgPSAwXHJcbiAgICBnZXQgb2Zmc2V0KCl7IHJldHVybiB0aGlzLl9vZmZzZXQgfVxyXG4gICAgLy8vIGl0ZW0gaW5kZXhcclxuICAgIHByaXZhdGUgX2lkeDogbnVtYmVyID0gLTFcclxuICAgIHNldCBpdGVtSWR4KCB2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8vIHNldCBpZHgg55qE5pe25YCZ55u05o6l6K6+572u5aW95a+55bqU55qEIG9mZnNldCDpgb/lhY1nZXQg55qE5pe25YCZ5YaN5YGaaWYg5Yik5patXHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gKHZhbHVlID09PSAwKT8gdGhpcy5zdGFydE9mZnNldDogMFxyXG4gICAgICAgIHRoaXMuX2lkeCA9IHZhbHVlXHJcbiAgICB9XHJcbiAgICBnZXQgaXRlbUlkeCgpIHsgcmV0dXJuIHRoaXMuX2lkeH1cclxuICAgIFxyXG4gICAgLy8vIGN1cnJlbnQgbG9vcCBsaXN0XHJcbiAgICBsb29wbGlzdDogTG9vcExpc3QgPSBudWxsIFxyXG5cclxuICAgIG9uRW5hYmxlKCkgeyB0aGlzLm5vZGUub24oIGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5vblNpemVDaGFuZ2VkLCB0aGlzKSB9XHJcblxyXG4gICAgb25EaXNhYmxlKCkgeyB0aGlzLm5vZGUub2ZmKCBjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMub25TaXplQ2hhbmdlZCwgdGhpcykgfVxyXG5cclxuICAgIHByaXZhdGUgb25TaXplQ2hhbmdlZCgpIHtcclxuICAgICAgICBpZiggdGhpcy5sb29wbGlzdCkgeyAgdGhpcy5sb29wbGlzdC5pdGVtU2l6ZUNoYW5nZWQoKSB9XHJcbiAgICB9XHJcbn0iXX0=