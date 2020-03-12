
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
// scripts/LoopListItem.ts

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0xvb3BMaXN0SXRlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRU0sSUFBQSxrQkFBbUMsRUFBbEMsb0JBQU8sRUFBRSxzQkFBeUIsQ0FBQztBQUcxQztJQUEwQyxnQ0FBWTtJQUR0RDtRQUFBLHFFQWdDQztRQTlCRyxxQkFBcUI7UUFFYixpQkFBVyxHQUFXLENBQUMsQ0FBQTtRQUMvQixnQkFBZ0I7UUFFaEIsYUFBTyxHQUFXLENBQUMsQ0FBQTtRQUNuQixrQkFBa0I7UUFDWCxhQUFPLEdBQVcsSUFBSSxDQUFBO1FBQzdCLHVCQUF1QjtRQUNmLGFBQU8sR0FBVyxDQUFDLENBQUE7UUFFM0IsY0FBYztRQUNOLFVBQUksR0FBVyxDQUFDLENBQUMsQ0FBQTtRQVF6QixxQkFBcUI7UUFDckIsY0FBUSxHQUFhLElBQUksQ0FBQTs7SUFTN0IsQ0FBQztJQXBCRyxzQkFBSSxnQ0FBTTthQUFWLGNBQWMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQzs7O09BQUE7SUFHbkMsc0JBQUksaUNBQU87YUFLWCxjQUFnQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUEsQ0FBQSxDQUFDO2FBTGpDLFVBQWEsS0FBYTtZQUN0QiwrQ0FBK0M7WUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2pELElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1FBQ3JCLENBQUM7OztPQUFBO0lBTUQsK0JBQVEsR0FBUixjQUFhLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUV0RixnQ0FBUyxHQUFULGNBQWMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRWhGLG9DQUFhLEdBQXJCO1FBQ0ksSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtTQUFFO0lBQzNELENBQUM7SUEzQkQ7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztxREFDVztJQUcvQjtRQURDLFFBQVEsQ0FBRSxFQUFFLENBQUMsS0FBSyxDQUFDO2lEQUNEO0lBTkYsWUFBWTtRQURoQyxPQUFPO09BQ2EsWUFBWSxDQStCaEM7SUFBRCxtQkFBQztDQS9CRCxBQStCQyxDQS9CeUMsRUFBRSxDQUFDLFNBQVMsR0ErQnJEO2tCQS9Cb0IsWUFBWSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb29wTGlzdCBmcm9tIFwiLi9Mb29wTGlzdFwiO1xyXG5cclxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb29wTGlzdEl0ZW0gZXh0ZW5kcyBjYy5Db21wb25lbnQge1xyXG4gICAgLy8vIGl0ZW0gc3RhcnQgb2Zmc2V0XHJcbiAgICBAcHJvcGVydHkoIGNjLkZsb2F0KVxyXG4gICAgcHJpdmF0ZSBzdGFydE9mZnNldDogbnVtYmVyID0gMFxyXG4gICAgLy8vIGl0ZW0gcGFkZGluZ1xyXG4gICAgQHByb3BlcnR5KCBjYy5GbG9hdClcclxuICAgIHBhZGRpbmc6IG51bWJlciA9IDBcclxuICAgIC8vLyBpdGVtIGNhY2hlIGtleVxyXG4gICAgcHVibGljIGl0ZW1LZXk6IHN0cmluZyA9IG51bGxcclxuICAgIC8vLyByZWNvcmQgaXRlbSBvZmZzZXQgXHJcbiAgICBwcml2YXRlIF9vZmZzZXQ6IG51bWJlciA9IDBcclxuICAgIGdldCBvZmZzZXQoKXsgcmV0dXJuIHRoaXMuX29mZnNldCB9XHJcbiAgICAvLy8gaXRlbSBpbmRleFxyXG4gICAgcHJpdmF0ZSBfaWR4OiBudW1iZXIgPSAtMVxyXG4gICAgc2V0IGl0ZW1JZHgoIHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAvLy8gc2V0IGlkeCDnmoTml7blgJnnm7TmjqXorr7nva7lpb3lr7nlupTnmoQgb2Zmc2V0IOmBv+WFjWdldCDnmoTml7blgJnlho3lgZppZiDliKTmlq1cclxuICAgICAgICB0aGlzLl9vZmZzZXQgPSAodmFsdWUgPT09IDApPyB0aGlzLnN0YXJ0T2Zmc2V0OiAwXHJcbiAgICAgICAgdGhpcy5faWR4ID0gdmFsdWVcclxuICAgIH1cclxuICAgIGdldCBpdGVtSWR4KCkgeyByZXR1cm4gdGhpcy5faWR4fVxyXG4gICAgXHJcbiAgICAvLy8gY3VycmVudCBsb29wIGxpc3RcclxuICAgIGxvb3BsaXN0OiBMb29wTGlzdCA9IG51bGwgXHJcblxyXG4gICAgb25FbmFibGUoKSB7IHRoaXMubm9kZS5vbiggY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLm9uU2l6ZUNoYW5nZWQsIHRoaXMpIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKSB7IHRoaXMubm9kZS5vZmYoIGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5vblNpemVDaGFuZ2VkLCB0aGlzKSB9XHJcblxyXG4gICAgcHJpdmF0ZSBvblNpemVDaGFuZ2VkKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLmxvb3BsaXN0KSB7ICB0aGlzLmxvb3BsaXN0Lml0ZW1TaXplQ2hhbmdlZCgpIH1cclxuICAgIH1cclxufSJdfQ==