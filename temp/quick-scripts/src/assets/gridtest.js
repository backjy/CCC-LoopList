"use strict";
cc._RF.push(module, '507bfF+y95L/YHUTN65u1AA', 'gridtest');
// gridtest.ts

Object.defineProperty(exports, "__esModule", { value: true });
var LoopListGrid_1 = require("./looplist/LoopListGrid");
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var gridtest = /** @class */ (function (_super) {
    __extends(gridtest, _super);
    function gridtest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gridview = null;
        _this.hgridview = null;
        return _this;
        // update (dt) {}
    }
    gridtest.prototype.start = function () {
        this.gridview.initialize(function (view, idx) {
            var item = view.getNewItem();
            item.getComponent(cc.Label).string = "v item\n" + idx;
            return item;
        });
        this.gridview.setItemCount(200);
        this.hgridview.initialize(function (view, idx) {
            var item = view.getNewItem();
            item.getComponent(cc.Label).string = "h item\n" + idx;
            return item;
        });
        this.hgridview.setItemCount(200);
    };
    __decorate([
        property(LoopListGrid_1.default)
    ], gridtest.prototype, "gridview", void 0);
    __decorate([
        property(LoopListGrid_1.default)
    ], gridtest.prototype, "hgridview", void 0);
    gridtest = __decorate([
        ccclass
    ], gridtest);
    return gridtest;
}(cc.Component));
exports.default = gridtest;

cc._RF.pop();