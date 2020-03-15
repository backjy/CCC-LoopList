"use strict";
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