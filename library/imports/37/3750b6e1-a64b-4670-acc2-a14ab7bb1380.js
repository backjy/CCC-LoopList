"use strict";
cc._RF.push(module, '3750bbhpktGcKzCoUq3uxOA', 'test');
// test.ts

Object.defineProperty(exports, "__esModule", { value: true });
var LoopList_1 = require("./looplist/LoopList");
var Touchable_1 = require("./looplist/Touchable");
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var test = /** @class */ (function (_super) {
    __extends(test, _super);
    function test() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.list = null;
        _this.add = null;
        _this.substract = null;
        _this.showFrist = null;
        _this.showMid = null;
        _this.showLast = null;
        _this.amount = 10;
        _this.count = 0;
        return _this;
        // update (dt) {}
    }
    test.prototype.start = function () {
        var _this = this;
        this.list.initialize(this.onCreateItem.bind(this));
        this.add.clicked = function () {
            _this.count += _this.amount;
            console.log("set item count:", _this.count);
            _this.list.setItemCount(_this.count);
        };
        this.substract.clicked = function () {
            _this.count -= _this.amount;
            console.log("set item count:", _this.count);
            _this.list.setItemCount(_this.count);
        };
        this.showFrist.clicked = function () {
            _this.list.showItem(0);
        };
        this.showMid.clicked = function () {
            console.log("show item:", Math.floor(_this.count / 2));
            _this.list.showItem(Math.floor(_this.count / 2));
        };
        this.showLast.clicked = function () {
            _this.list.showItem(_this.count - 1, true);
        };
    };
    test.prototype.onCreateItem = function (list, idx) {
        console.log(this.name + " show idx: " + idx);
        var item = this.list.getItem();
        item.getComponent(cc.Label).string = "this\nis\n" + idx;
        return item;
    };
    __decorate([
        property(LoopList_1.default)
    ], test.prototype, "list", void 0);
    __decorate([
        property(Touchable_1.default)
    ], test.prototype, "add", void 0);
    __decorate([
        property(Touchable_1.default)
    ], test.prototype, "substract", void 0);
    __decorate([
        property(Touchable_1.default)
    ], test.prototype, "showFrist", void 0);
    __decorate([
        property(Touchable_1.default)
    ], test.prototype, "showMid", void 0);
    __decorate([
        property(Touchable_1.default)
    ], test.prototype, "showLast", void 0);
    __decorate([
        property(cc.Integer)
    ], test.prototype, "amount", void 0);
    test = __decorate([
        ccclass
    ], test);
    return test;
}(cc.Component));
exports.default = test;

cc._RF.pop();