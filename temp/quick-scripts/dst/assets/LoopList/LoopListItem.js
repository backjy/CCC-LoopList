
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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
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
        ccclass,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Mb29wTGlzdEl0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVNLElBQUEsa0JBQXlDLEVBQXhDLG9CQUFPLEVBQUUsc0JBQVEsRUFBRSxjQUFxQixDQUFDO0FBSWhEO0lBQTBDLGdDQUFZO0lBRnREO1FBQUEscUVBaUNDO1FBOUJHLHFCQUFxQjtRQUViLGlCQUFXLEdBQVcsQ0FBQyxDQUFBO1FBQy9CLGdCQUFnQjtRQUVoQixhQUFPLEdBQVcsQ0FBQyxDQUFBO1FBQ25CLGtCQUFrQjtRQUNYLGFBQU8sR0FBVyxJQUFJLENBQUE7UUFDN0IsdUJBQXVCO1FBQ2YsYUFBTyxHQUFXLENBQUMsQ0FBQTtRQUUzQixjQUFjO1FBQ04sVUFBSSxHQUFXLENBQUMsQ0FBQyxDQUFBO1FBUXpCLHFCQUFxQjtRQUNyQixjQUFRLEdBQWEsSUFBSSxDQUFBOztJQVM3QixDQUFDO0lBcEJHLHNCQUFJLGdDQUFNO2FBQVYsY0FBYyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDOzs7T0FBQTtJQUduQyxzQkFBSSxpQ0FBTzthQUtYLGNBQWdCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQSxDQUFBLENBQUM7YUFMakMsVUFBYSxLQUFhO1lBQ3RCLCtDQUErQztZQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7UUFDckIsQ0FBQzs7O09BQUE7SUFNRCwrQkFBUSxHQUFSLGNBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRXRGLGdDQUFTLEdBQVQsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFaEYsb0NBQWEsR0FBckI7UUFDSSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFBO1NBQUU7SUFDM0QsQ0FBQztJQTNCRDtRQURDLFFBQVEsQ0FBRSxFQUFFLENBQUMsS0FBSyxDQUFDO3FEQUNXO0lBRy9CO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7aURBQ0Q7SUFORixZQUFZO1FBRmhDLE9BQU87UUFDUCxJQUFJLENBQUMsMEJBQTBCLENBQUM7T0FDWixZQUFZLENBK0JoQztJQUFELG1CQUFDO0NBL0JELEFBK0JDLENBL0J5QyxFQUFFLENBQUMsU0FBUyxHQStCckQ7a0JBL0JvQixZQUFZIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvb3BMaXN0IGZyb20gXCIuL0xvb3BMaXN0XCI7XHJcblxyXG5jb25zdCB7Y2NjbGFzcywgcHJvcGVydHksIG1lbnV9ID0gY2MuX2RlY29yYXRvcjtcclxuXHJcbkBjY2NsYXNzXHJcbkBtZW51KFwiVUlFeHRlbnNpb24vTG9vcExpc3RJdGVtXCIpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvb3BMaXN0SXRlbSBleHRlbmRzIGNjLkNvbXBvbmVudCB7XHJcbiAgICAvLy8gaXRlbSBzdGFydCBvZmZzZXRcclxuICAgIEBwcm9wZXJ0eSggY2MuRmxvYXQpXHJcbiAgICBwcml2YXRlIHN0YXJ0T2Zmc2V0OiBudW1iZXIgPSAwXHJcbiAgICAvLy8gaXRlbSBwYWRkaW5nXHJcbiAgICBAcHJvcGVydHkoIGNjLkZsb2F0KVxyXG4gICAgcGFkZGluZzogbnVtYmVyID0gMFxyXG4gICAgLy8vIGl0ZW0gY2FjaGUga2V5XHJcbiAgICBwdWJsaWMgaXRlbUtleTogc3RyaW5nID0gbnVsbFxyXG4gICAgLy8vIHJlY29yZCBpdGVtIG9mZnNldCBcclxuICAgIHByaXZhdGUgX29mZnNldDogbnVtYmVyID0gMFxyXG4gICAgZ2V0IG9mZnNldCgpeyByZXR1cm4gdGhpcy5fb2Zmc2V0IH1cclxuICAgIC8vLyBpdGVtIGluZGV4XHJcbiAgICBwcml2YXRlIF9pZHg6IG51bWJlciA9IC0xXHJcbiAgICBzZXQgaXRlbUlkeCggdmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIC8vLyBzZXQgaWR4IOeahOaXtuWAmeebtOaOpeiuvue9ruWlveWvueW6lOeahCBvZmZzZXQg6YG/5YWNZ2V0IOeahOaXtuWAmeWGjeWBmmlmIOWIpOaWrVxyXG4gICAgICAgIHRoaXMuX29mZnNldCA9ICh2YWx1ZSA9PT0gMCk/IHRoaXMuc3RhcnRPZmZzZXQ6IDBcclxuICAgICAgICB0aGlzLl9pZHggPSB2YWx1ZVxyXG4gICAgfVxyXG4gICAgZ2V0IGl0ZW1JZHgoKSB7IHJldHVybiB0aGlzLl9pZHh9XHJcbiAgICBcclxuICAgIC8vLyBjdXJyZW50IGxvb3AgbGlzdFxyXG4gICAgbG9vcGxpc3Q6IExvb3BMaXN0ID0gbnVsbCBcclxuXHJcbiAgICBvbkVuYWJsZSgpIHsgdGhpcy5ub2RlLm9uKCBjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMub25TaXplQ2hhbmdlZCwgdGhpcykgfVxyXG5cclxuICAgIG9uRGlzYWJsZSgpIHsgdGhpcy5ub2RlLm9mZiggY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLm9uU2l6ZUNoYW5nZWQsIHRoaXMpIH1cclxuXHJcbiAgICBwcml2YXRlIG9uU2l6ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgaWYoIHRoaXMubG9vcGxpc3QpIHsgIHRoaXMubG9vcGxpc3QuaXRlbVNpemVDaGFuZ2VkKCkgfVxyXG4gICAgfVxyXG59Il19