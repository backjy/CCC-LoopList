"use strict";
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