
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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, disallowMultiple = _a.disallowMultiple;
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
        /// 添加用户自定义绑定数据
        _this._userData = null;
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
    Object.defineProperty(LoopListItem.prototype, "userData", {
        get: function () { return this._userData; },
        set: function (value) { this._userData = value; },
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
        ccclass,
        disallowMultiple,
        menu("UIExtension/LoopListItem")
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVNLElBQUEsa0JBQTJELEVBQTFELG9CQUFPLEVBQUUsc0JBQVEsRUFBRSxjQUFJLEVBQUUsc0NBQWlDLENBQUM7QUFLbEU7SUFBMEMsZ0NBQVk7SUFIdEQ7UUFBQSxxRUFzQ0M7UUFsQ0cscUJBQXFCO1FBRWIsaUJBQVcsR0FBVyxDQUFDLENBQUE7UUFDL0IsZ0JBQWdCO1FBRWhCLGFBQU8sR0FBVyxDQUFDLENBQUE7UUFDbkIsa0JBQWtCO1FBQ1gsYUFBTyxHQUFXLElBQUksQ0FBQTtRQUM3Qix1QkFBdUI7UUFDZixhQUFPLEdBQVcsQ0FBQyxDQUFBO1FBRTNCLGNBQWM7UUFDTixVQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUE7UUFPekIsZUFBZTtRQUNQLGVBQVMsR0FBUSxJQUFJLENBQUE7UUFJN0IscUJBQXFCO1FBQ3JCLGNBQVEsR0FBYSxJQUFJLENBQUE7O0lBUzdCLENBQUM7SUF4Qkcsc0JBQUksZ0NBQU07YUFBVixjQUFjLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7OztPQUFBO0lBR25DLHNCQUFJLGlDQUFPO2FBS1gsY0FBZ0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBLENBQUEsQ0FBQzthQUxqQyxVQUFhLEtBQWE7WUFDdEIsK0NBQStDO1lBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtRQUNyQixDQUFDOzs7T0FBQTtJQUlELHNCQUFJLGtDQUFRO2FBQVosY0FBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQzthQUN2QyxVQUFjLEtBQVUsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQSxDQUFBLENBQUM7OztPQURaO0lBTXZDLCtCQUFRLEdBQVIsY0FBYSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFdEYsZ0NBQVMsR0FBVCxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUVoRixvQ0FBYSxHQUFyQjtRQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLENBQUE7U0FBRTtJQUMzRCxDQUFDO0lBL0JEO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7cURBQ1c7SUFHL0I7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztpREFDRDtJQU5GLFlBQVk7UUFIaEMsT0FBTztRQUNQLGdCQUFnQjtRQUNoQixJQUFJLENBQUMsMEJBQTBCLENBQUM7T0FDWixZQUFZLENBbUNoQztJQUFELG1CQUFDO0NBbkNELEFBbUNDLENBbkN5QyxFQUFFLENBQUMsU0FBUyxHQW1DckQ7a0JBbkNvQixZQUFZIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvb3BMaXN0IGZyb20gXCIuL0xvb3BMaXN0XCI7XHJcblxyXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHksIG1lbnUsIGRpc2FsbG93TXVsdGlwbGV9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbkBkaXNhbGxvd011bHRpcGxlXHJcbkBtZW51KFwiVUlFeHRlbnNpb24vTG9vcExpc3RJdGVtXCIpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3BMaXN0SXRlbSBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcbiAgICAvLy8gaXRlbSBzdGFydCBvZmZzZXRcclxuICAgIEBwcm9wZXJ0eSggY2MuRmxvYXQpXHJcbiAgICBwcml2YXRlIHN0YXJ0T2Zmc2V0OiBudW1iZXIgPSAwXHJcbiAgICAvLy8gaXRlbSBwYWRkaW5nXHJcbiAgICBAcHJvcGVydHkoIGNjLkZsb2F0KVxyXG4gICAgcGFkZGluZzogbnVtYmVyID0gMFxyXG4gICAgLy8vIGl0ZW0gY2FjaGUga2V5XHJcbiAgICBwdWJsaWMgaXRlbUtleTogc3RyaW5nID0gbnVsbFxyXG4gICAgLy8vIHJlY29yZCBpdGVtIG9mZnNldCBcclxuICAgIHByaXZhdGUgX29mZnNldDogbnVtYmVyID0gMFxyXG4gICAgZ2V0IG9mZnNldCgpeyByZXR1cm4gdGhpcy5fb2Zmc2V0IH1cclxuICAgIC8vLyBpdGVtIGluZGV4XHJcbiAgICBwcml2YXRlIF9pZHg6IG51bWJlciA9IC0xXHJcbiAgICBzZXQgaXRlbUlkeCggdmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vLyBzZXQgaWR4IOeahOaXtuWAmeebtOaOpeiuvue9ruWlveWvueW6lOeahCBvZmZzZXQg6YG/5YWNZ2V0IOeahOaXtuWAmeWGjeWBmmlmIOWIpOaWrVxyXG4gICAgICAgIHRoaXMuX29mZnNldCA9ICh2YWx1ZSA9PT0gMCk/IHRoaXMuc3RhcnRPZmZzZXQ6IDBcclxuICAgICAgICB0aGlzLl9pZHggPSB2YWx1ZVxyXG4gICAgfVxyXG4gICAgZ2V0IGl0ZW1JZHgoKSB7IHJldHVybiB0aGlzLl9pZHh9XHJcbiAgICAvLy8g5re75Yqg55So5oi36Ieq5a6a5LmJ57uR5a6a5pWw5o2uXHJcbiAgICBwcml2YXRlIF91c2VyRGF0YTogYW55ID0gbnVsbFxyXG4gICAgZ2V0IHVzZXJEYXRhKCl7IHJldHVybiB0aGlzLl91c2VyRGF0YSB9XHJcbiAgICBzZXQgdXNlckRhdGEoIHZhbHVlOiBhbnkpIHsgdGhpcy5fdXNlckRhdGEgPSB2YWx1ZX1cclxuICAgIFxyXG4gICAgLy8vIGN1cnJlbnQgbG9vcCBsaXN0XHJcbiAgICBsb29wbGlzdDogTG9vcExpc3QgPSBudWxsIFxyXG5cclxuICAgIG9uRW5hYmxlKCkgeyB0aGlzLm5vZGUub24oIGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5vblNpemVDaGFuZ2VkLCB0aGlzKSB9XHJcblxyXG4gICAgb25EaXNhYmxlKCkgeyB0aGlzLm5vZGUub2ZmKCBjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMub25TaXplQ2hhbmdlZCwgdGhpcykgfVxyXG5cclxuICAgIHByaXZhdGUgb25TaXplQ2hhbmdlZCgpIHtcclxuICAgICAgICBpZiggdGhpcy5sb29wbGlzdCkgeyAgdGhpcy5sb29wbGlzdC5pdGVtU2l6ZUNoYW5nZWQoKSB9XHJcbiAgICB9XHJcbn0iXX0=