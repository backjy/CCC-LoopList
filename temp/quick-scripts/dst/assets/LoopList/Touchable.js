
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/looplist/Touchable.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '33309ZcD1xHR6WNKIcqLFRn', 'Touchable');
// looplist/Touchable.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
/// 点击间隔
var click_interval = 1;
var Touchable = /** @class */ (function (_super) {
    __extends(Touchable, _super);
    function Touchable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.interactable = true;
        _this.audioClip = null;
        _this.clicked = null;
        _this._pressed = false;
        return _this;
    }
    // private mark: number = 0
    Touchable.prototype.onEnable = function () {
        this._registerNodeEvent();
    };
    Touchable.prototype.onDisable = function () {
        this._unregisterNodeEvent();
    };
    /// on node event
    Touchable.prototype._registerNodeEvent = function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    };
    Touchable.prototype._unregisterNodeEvent = function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    };
    // touch event handler
    Touchable.prototype._onTouchBegan = function (event) {
        if (!this.interactable || !this.enabledInHierarchy)
            return;
        this._pressed = true;
        event.stopPropagation();
        /// play audio clip
        if (this.audioClip) {
            cc.audioEngine.play(this.audioClip, false, 1);
        }
    };
    Touchable.prototype._onTouchMove = function (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed)
            return;
        event.stopPropagation();
    };
    Touchable.prototype._onTouchEnded = function (event) {
        if (!this.interactable || !this.enabledInHierarchy)
            return;
        this._pressed = false;
        event.stopPropagation();
        if (this.clicked) {
            this.clicked();
        }
    };
    Touchable.prototype._onTouchCancel = function () {
        if (!this.interactable || !this.enabledInHierarchy)
            return;
        this._pressed = false;
    };
    __decorate([
        property(cc.Boolean)
    ], Touchable.prototype, "interactable", void 0);
    __decorate([
        property(cc.AudioClip)
    ], Touchable.prototype, "audioClip", void 0);
    Touchable = __decorate([
        ccclass,
        menu("UIExtension/Touchable")
    ], Touchable);
    return Touchable;
}(cc.Component));
exports.default = Touchable;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Ub3VjaGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUdNLElBQUEsa0JBQXlDLEVBQXhDLG9CQUFPLEVBQUUsc0JBQVEsRUFBRSxjQUFxQixDQUFDO0FBRWhELFFBQVE7QUFDUixJQUFNLGNBQWMsR0FBVyxDQUFDLENBQUE7QUFJaEM7SUFBdUMsNkJBQVk7SUFGbkQ7UUFBQSxxRUE4REM7UUExRFUsa0JBQVksR0FBWSxJQUFJLENBQUE7UUFHNUIsZUFBUyxHQUFpQixJQUFJLENBQUE7UUFFOUIsYUFBTyxHQUFhLElBQUksQ0FBQTtRQTJCdkIsY0FBUSxHQUFZLEtBQUssQ0FBQTs7SUEwQnJDLENBQUM7SUFuREcsMkJBQTJCO0lBRTNCLDRCQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0lBRUQsNkJBQVMsR0FBVDtRQUNJLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO0lBQy9CLENBQUM7SUFFRCxpQkFBaUI7SUFDakIsc0NBQWtCLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELHdDQUFvQixHQUFwQjtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFHRCxzQkFBc0I7SUFDdEIsaUNBQWEsR0FBYixVQUFlLEtBQUs7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCO1lBQUUsT0FBTztRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsbUJBQW1CO1FBQ25CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQUU7SUFDMUUsQ0FBQztJQUVELGdDQUFZLEdBQVosVUFBYyxLQUFLO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFDN0UsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxpQ0FBYSxHQUFiLFVBQWUsS0FBSztRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0I7WUFBRSxPQUFPO1FBQzNELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7U0FBQztJQUN2QyxDQUFDO0lBRUQsa0NBQWMsR0FBZDtRQUNJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQjtZQUFFLE9BQU87UUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQXpERDtRQURDLFFBQVEsQ0FBRSxFQUFFLENBQUMsT0FBTyxDQUFDO21EQUNhO0lBR25DO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0RBQ2E7SUFMcEIsU0FBUztRQUY3QixPQUFPO1FBQ1AsSUFBSSxDQUFDLHVCQUF1QixDQUFDO09BQ1QsU0FBUyxDQTREN0I7SUFBRCxnQkFBQztDQTVERCxBQTREQyxDQTVEc0MsRUFBRSxDQUFDLFNBQVMsR0E0RGxEO2tCQTVEb0IsU0FBUyIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eSwgbWVudX0gPSBjYy5fZGVjb3JhdG9yO1xyXG5cclxuLy8vIOeCueWHu+mXtOmalFxyXG5jb25zdCBjbGlja19pbnRlcnZhbDogbnVtYmVyID0gMVxyXG5cclxuQGNjY2xhc3NcclxuQG1lbnUoXCJVSUV4dGVuc2lvbi9Ub3VjaGFibGVcIilcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG91Y2hhYmxlIGV4dGVuZHMgY2MuQ29tcG9uZW50e1xyXG4gICAgQHByb3BlcnR5KCBjYy5Cb29sZWFuKVxyXG4gICAgcHVibGljIGludGVyYWN0YWJsZTogYm9vbGVhbiA9IHRydWVcclxuXHJcbiAgICBAcHJvcGVydHkoIGNjLkF1ZGlvQ2xpcClcclxuICAgIHB1YmxpYyBhdWRpb0NsaXA6IGNjLkF1ZGlvQ2xpcCA9IG51bGxcclxuXHJcbiAgICBwdWJsaWMgY2xpY2tlZDogKCk9PnZvaWQgPSBudWxsXHJcblxyXG4gICAgLy8gcHJpdmF0ZSBtYXJrOiBudW1iZXIgPSAwXHJcblxyXG4gICAgb25FbmFibGUoKXtcclxuICAgICAgICB0aGlzLl9yZWdpc3Rlck5vZGVFdmVudCgpXHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlKCl7XHJcbiAgICAgICAgdGhpcy5fdW5yZWdpc3Rlck5vZGVFdmVudCgpXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLyBvbiBub2RlIGV2ZW50XHJcbiAgICBfcmVnaXN0ZXJOb2RlRXZlbnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbCwgdGhpcyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIF91bnJlZ2lzdGVyTm9kZUV2ZW50ICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl9vblRvdWNoQ2FuY2VsLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wcmVzc2VkOiBib29sZWFuID0gZmFsc2VcclxuICAgIC8vIHRvdWNoIGV2ZW50IGhhbmRsZXJcclxuICAgIF9vblRvdWNoQmVnYW4gKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAvLy8gcGxheSBhdWRpbyBjbGlwXHJcbiAgICAgICAgaWYoIHRoaXMuYXVkaW9DbGlwKSB7IGNjLmF1ZGlvRW5naW5lLnBsYXkoIHRoaXMuYXVkaW9DbGlwLCBmYWxzZSwgMSkgfVxyXG4gICAgfVxyXG5cclxuICAgIF9vblRvdWNoTW92ZSAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSB8fCAhdGhpcy5fcHJlc3NlZCkgcmV0dXJuO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIF9vblRvdWNoRW5kZWQgKGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9wcmVzc2VkID0gZmFsc2U7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgaWYoIHRoaXMuY2xpY2tlZCkgeyB0aGlzLmNsaWNrZWQoKX1cclxuICAgIH1cclxuXHJcbiAgICBfb25Ub3VjaENhbmNlbCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCAhdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9wcmVzc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcbn0iXX0=