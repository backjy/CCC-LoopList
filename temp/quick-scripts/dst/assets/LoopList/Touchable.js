
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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
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
        ccclass
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9sb29wbGlzdC9Ub3VjaGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUdNLElBQUEsa0JBQW1DLEVBQWxDLG9CQUFPLEVBQUUsc0JBQXlCLENBQUM7QUFFMUMsUUFBUTtBQUNSLElBQU0sY0FBYyxHQUFXLENBQUMsQ0FBQTtBQUdoQztJQUF1Qyw2QkFBWTtJQURuRDtRQUFBLHFFQTZEQztRQTFEVSxrQkFBWSxHQUFZLElBQUksQ0FBQTtRQUc1QixlQUFTLEdBQWlCLElBQUksQ0FBQTtRQUU5QixhQUFPLEdBQWEsSUFBSSxDQUFBO1FBMkJ2QixjQUFRLEdBQVksS0FBSyxDQUFBOztJQTBCckMsQ0FBQztJQW5ERywyQkFBMkI7SUFFM0IsNEJBQVEsR0FBUjtRQUNJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO0lBQzdCLENBQUM7SUFFRCw2QkFBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUE7SUFDL0IsQ0FBQztJQUVELGlCQUFpQjtJQUNqQixzQ0FBa0IsR0FBbEI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQsd0NBQW9CLEdBQXBCO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUdELHNCQUFzQjtJQUN0QixpQ0FBYSxHQUFiLFVBQWUsS0FBSztRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0I7WUFBRSxPQUFPO1FBQzNELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN4QixtQkFBbUI7UUFDbkIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FBRTtJQUMxRSxDQUFDO0lBRUQsZ0NBQVksR0FBWixVQUFjLEtBQUs7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO1lBQUUsT0FBTztRQUM3RSxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGlDQUFhLEdBQWIsVUFBZSxLQUFLO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQjtZQUFFLE9BQU87UUFDM0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUFDO0lBQ3ZDLENBQUM7SUFFRCxrQ0FBYyxHQUFkO1FBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCO1lBQUUsT0FBTztRQUMzRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBekREO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7bURBQ2E7SUFHbkM7UUFEQyxRQUFRLENBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQztnREFDYTtJQUxwQixTQUFTO1FBRDdCLE9BQU87T0FDYSxTQUFTLENBNEQ3QjtJQUFELGdCQUFDO0NBNURELEFBNERDLENBNURzQyxFQUFFLENBQUMsU0FBUyxHQTREbEQ7a0JBNURvQixTQUFTIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5cclxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XHJcblxyXG4vLy8g54K55Ye76Ze06ZqUXHJcbmNvbnN0IGNsaWNrX2ludGVydmFsOiBudW1iZXIgPSAxXHJcblxyXG5AY2NjbGFzc1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb3VjaGFibGUgZXh0ZW5kcyBjYy5Db21wb25lbnR7XHJcbiAgICBAcHJvcGVydHkoIGNjLkJvb2xlYW4pXHJcbiAgICBwdWJsaWMgaW50ZXJhY3RhYmxlOiBib29sZWFuID0gdHJ1ZVxyXG5cclxuICAgIEBwcm9wZXJ0eSggY2MuQXVkaW9DbGlwKVxyXG4gICAgcHVibGljIGF1ZGlvQ2xpcDogY2MuQXVkaW9DbGlwID0gbnVsbFxyXG5cclxuICAgIHB1YmxpYyBjbGlja2VkOiAoKT0+dm9pZCA9IG51bGxcclxuXHJcbiAgICAvLyBwcml2YXRlIG1hcms6IG51bWJlciA9IDBcclxuXHJcbiAgICBvbkVuYWJsZSgpe1xyXG4gICAgICAgIHRoaXMuX3JlZ2lzdGVyTm9kZUV2ZW50KClcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUoKXtcclxuICAgICAgICB0aGlzLl91bnJlZ2lzdGVyTm9kZUV2ZW50KClcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8vIG9uIG5vZGUgZXZlbnRcclxuICAgIF9yZWdpc3Rlck5vZGVFdmVudCAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLCB0aGlzLl9vblRvdWNoQ2FuY2VsLCB0aGlzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgX3VucmVnaXN0ZXJOb2RlRXZlbnQgKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hCZWdhbiwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIHRoaXMuX29uVG91Y2hDYW5jZWwsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3ByZXNzZWQ6IGJvb2xlYW4gPSBmYWxzZVxyXG4gICAgLy8gdG91Y2ggZXZlbnQgaGFuZGxlclxyXG4gICAgX29uVG91Y2hCZWdhbiAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIC8vLyBwbGF5IGF1ZGlvIGNsaXBcclxuICAgICAgICBpZiggdGhpcy5hdWRpb0NsaXApIHsgY2MuYXVkaW9FbmdpbmUucGxheSggdGhpcy5hdWRpb0NsaXAsIGZhbHNlLCAxKSB9XHJcbiAgICB9XHJcblxyXG4gICAgX29uVG91Y2hNb3ZlIChldmVudCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5IHx8ICF0aGlzLl9wcmVzc2VkKSByZXR1cm47XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgX29uVG91Y2hFbmRlZCAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBpZiggdGhpcy5jbGlja2VkKSB7IHRoaXMuY2xpY2tlZCgpfVxyXG4gICAgfVxyXG5cclxuICAgIF9vblRvdWNoQ2FuY2VsICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW50ZXJhY3RhYmxlIHx8ICF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3ByZXNzZWQgPSBmYWxzZTtcclxuICAgIH1cclxufSJdfQ==