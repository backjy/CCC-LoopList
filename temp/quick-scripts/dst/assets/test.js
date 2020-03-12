
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/test.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
            _this.list.showItem(_this.count - 1);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O1FBREMsUUFBUSxDQUFFLGtCQUFRLENBQUM7c0NBQ0M7SUFHckI7UUFEQyxRQUFRLENBQUUsbUJBQVMsQ0FBQztxQ0FDQTtJQUdyQjtRQURDLFFBQVEsQ0FBRSxtQkFBUyxDQUFDOzJDQUNNO0lBRzNCO1FBREMsUUFBUSxDQUFFLG1CQUFTLENBQUM7MkNBQ007SUFHM0I7UUFEQyxRQUFRLENBQUUsbUJBQVMsQ0FBQzt5Q0FDSTtJQUd6QjtRQURDLFFBQVEsQ0FBRSxtQkFBUyxDQUFDOzBDQUNLO0lBRzFCO1FBREMsUUFBUSxDQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0NBQ0g7SUFyQkYsSUFBSTtRQUR4QixPQUFPO09BQ2EsSUFBSSxDQThEeEI7SUFBRCxXQUFDO0NBOURELEFBOERDLENBOURpQyxFQUFFLENBQUMsU0FBUyxHQThEN0M7a0JBOURvQixJQUFJIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvb3BMaXN0IGZyb20gXCIuL2xvb3BsaXN0L0xvb3BMaXN0XCI7XG5pbXBvcnQgVG91Y2hhYmxlIGZyb20gXCIuL2xvb3BsaXN0L1RvdWNoYWJsZVwiO1xuXG4vLyBMZWFybiBUeXBlU2NyaXB0OlxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvdHlwZXNjcmlwdC5odG1sXG4vLyBMZWFybiBBdHRyaWJ1dGU6XG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB0ZXN0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIEBwcm9wZXJ0eSggTG9vcExpc3QpXG4gICAgbGlzdDogTG9vcExpc3QgPSBudWxsXG5cbiAgICBAcHJvcGVydHkoIFRvdWNoYWJsZSlcbiAgICBhZGQ6IFRvdWNoYWJsZSA9IG51bGxcblxuICAgIEBwcm9wZXJ0eSggVG91Y2hhYmxlKVxuICAgIHN1YnN0cmFjdDogVG91Y2hhYmxlID0gbnVsbFxuXG4gICAgQHByb3BlcnR5KCBUb3VjaGFibGUpXG4gICAgc2hvd0ZyaXN0OiBUb3VjaGFibGUgPSBudWxsXG5cbiAgICBAcHJvcGVydHkoIFRvdWNoYWJsZSlcbiAgICBzaG93TWlkOiBUb3VjaGFibGUgPSBudWxsXG5cbiAgICBAcHJvcGVydHkoIFRvdWNoYWJsZSlcbiAgICBzaG93TGFzdDogVG91Y2hhYmxlID0gbnVsbFxuXG4gICAgQHByb3BlcnR5KCBjYy5JbnRlZ2VyKVxuICAgIGFtb3VudDogbnVtYmVyID0gMTBcblxuICAgIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDBcblxuICAgIHN0YXJ0ICgpIHtcblxuICAgICAgICB0aGlzLmxpc3QuaW5pdGlhbGl6ZSggdGhpcy5vbkNyZWF0ZUl0ZW0uYmluZCh0aGlzKSlcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYWRkLmNsaWNrZWQgPSAoKT0+e1xuICAgICAgICAgICAgdGhpcy5jb3VudCArPSB0aGlzLmFtb3VudFxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwic2V0IGl0ZW0gY291bnQ6XCIsIHRoaXMuY291bnQpXG4gICAgICAgICAgICB0aGlzLmxpc3Quc2V0SXRlbUNvdW50KCB0aGlzLmNvdW50KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN1YnN0cmFjdC5jbGlja2VkID0gKCk9PntcbiAgICAgICAgICAgIHRoaXMuY291bnQgLT0gdGhpcy5hbW91bnRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcInNldCBpdGVtIGNvdW50OlwiLCB0aGlzLmNvdW50KVxuICAgICAgICAgICAgdGhpcy5saXN0LnNldEl0ZW1Db3VudCggdGhpcy5jb3VudClcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zaG93RnJpc3QuY2xpY2tlZCA9ICgpPT57XG4gICAgICAgICAgICB0aGlzLmxpc3Quc2hvd0l0ZW0oIDApXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2hvd01pZC5jbGlja2VkID0gKCk9PntcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcInNob3cgaXRlbTpcIiwgTWF0aC5mbG9vciggdGhpcy5jb3VudCAvIDIpKVxuICAgICAgICAgICAgdGhpcy5saXN0LnNob3dJdGVtKCBNYXRoLmZsb29yKCB0aGlzLmNvdW50IC8gMikpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2hvd0xhc3QuY2xpY2tlZCA9ICgpPT57XG4gICAgICAgICAgICB0aGlzLmxpc3Quc2hvd0l0ZW0oIHRoaXMuY291bnQgLSAxKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25DcmVhdGVJdGVtKCBsaXN0OiBMb29wTGlzdCwgaWR4OiBudW1iZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5uYW1lfSBzaG93IGlkeDogJHtpZHh9YClcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLmxpc3QuZ2V0SXRlbSgpXG4gICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KGNjLkxhYmVsKS5zdHJpbmcgPSBgdGhpc1xcbmlzXFxuJHtpZHh9YFxuICAgICAgICByZXR1cm4gaXRlbVxuICAgIH1cbiAgICAvLyB1cGRhdGUgKGR0KSB7fVxufVxuIl19