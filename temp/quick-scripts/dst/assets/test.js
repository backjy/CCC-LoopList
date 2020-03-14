
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
            _this.list.showItem(0, true);
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
        var item = this.list.getNewItem();
        item.getComponent(cc.Label).string = "this\nis\n" + idx;
        var touchable = item.getComponent(Touchable_1.default);
        if (touchable && touchable.clicked == null) {
            touchable.clicked = function () {
                console.log("on clicked: " + item.itemIdx);
            };
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBMkM7QUFDM0Msa0RBQTZDO0FBRTdDLG9CQUFvQjtBQUNwQix3RUFBd0U7QUFDeEUsbUJBQW1CO0FBQ25CLGtGQUFrRjtBQUNsRiw4QkFBOEI7QUFDOUIsa0ZBQWtGO0FBRTVFLElBQUEsa0JBQW1DLEVBQWxDLG9CQUFPLEVBQUUsc0JBQXlCLENBQUM7QUFHMUM7SUFBa0Msd0JBQVk7SUFEOUM7UUFBQSxxRUFzRUM7UUFsRUcsVUFBSSxHQUFhLElBQUksQ0FBQTtRQUdyQixTQUFHLEdBQWMsSUFBSSxDQUFBO1FBR3JCLGVBQVMsR0FBYyxJQUFJLENBQUE7UUFHM0IsZUFBUyxHQUFjLElBQUksQ0FBQTtRQUczQixhQUFPLEdBQWMsSUFBSSxDQUFBO1FBR3pCLGNBQVEsR0FBYyxJQUFJLENBQUE7UUFHMUIsWUFBTSxHQUFXLEVBQUUsQ0FBQTtRQUVYLFdBQUssR0FBVyxDQUFDLENBQUE7O1FBNkN6QixpQkFBaUI7SUFDckIsQ0FBQztJQTVDRyxvQkFBSyxHQUFMO1FBQUEsaUJBNEJDO1FBMUJHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7UUFFbkQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUc7WUFDZixLQUFJLENBQUMsS0FBSyxJQUFJLEtBQUksQ0FBQyxNQUFNLENBQUE7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBRSxpQkFBaUIsRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDM0MsS0FBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZDLENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHO1lBQ3JCLEtBQUksQ0FBQyxLQUFLLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQTtZQUN6QixPQUFPLENBQUMsR0FBRyxDQUFFLGlCQUFpQixFQUFFLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMzQyxLQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDdkMsQ0FBQyxDQUFBO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUc7WUFDckIsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ2hDLENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUUsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUUsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3ZELEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUUsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BELENBQUMsQ0FBQTtRQUVELElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHO1lBQ3BCLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQzdDLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCwyQkFBWSxHQUFaLFVBQWMsSUFBYyxFQUFFLEdBQVc7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsSUFBSSxtQkFBYyxHQUFLLENBQUMsQ0FBQTtRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxlQUFhLEdBQUssQ0FBQTtRQUN2RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFFLG1CQUFTLENBQUMsQ0FBQTtRQUM3QyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtZQUN4QyxTQUFTLENBQUMsT0FBTyxHQUFHO2dCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFFLGlCQUFlLElBQUksQ0FBQyxPQUFTLENBQUMsQ0FBQTtZQUMvQyxDQUFDLENBQUE7U0FDSjtRQUVELE9BQU8sSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQWhFRDtRQURDLFFBQVEsQ0FBRSxrQkFBUSxDQUFDO3NDQUNDO0lBR3JCO1FBREMsUUFBUSxDQUFFLG1CQUFTLENBQUM7cUNBQ0E7SUFHckI7UUFEQyxRQUFRLENBQUUsbUJBQVMsQ0FBQzsyQ0FDTTtJQUczQjtRQURDLFFBQVEsQ0FBRSxtQkFBUyxDQUFDOzJDQUNNO0lBRzNCO1FBREMsUUFBUSxDQUFFLG1CQUFTLENBQUM7eUNBQ0k7SUFHekI7UUFEQyxRQUFRLENBQUUsbUJBQVMsQ0FBQzswQ0FDSztJQUcxQjtRQURDLFFBQVEsQ0FBRSxFQUFFLENBQUMsT0FBTyxDQUFDO3dDQUNIO0lBckJGLElBQUk7UUFEeEIsT0FBTztPQUNhLElBQUksQ0FxRXhCO0lBQUQsV0FBQztDQXJFRCxBQXFFQyxDQXJFaUMsRUFBRSxDQUFDLFNBQVMsR0FxRTdDO2tCQXJFb0IsSUFBSSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBMb29wTGlzdCBmcm9tIFwiLi9sb29wbGlzdC9Mb29wTGlzdFwiO1xuaW1wb3J0IFRvdWNoYWJsZSBmcm9tIFwiLi9sb29wbGlzdC9Ub3VjaGFibGVcIjtcblxuLy8gTGVhcm4gVHlwZVNjcmlwdDpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3R5cGVzY3JpcHQuaHRtbFxuLy8gTGVhcm4gQXR0cmlidXRlOlxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG5cbmNvbnN0IHtjY2NsYXNzLCBwcm9wZXJ0eX0gPSBjYy5fZGVjb3JhdG9yO1xuXG5AY2NjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgdGVzdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBAcHJvcGVydHkoIExvb3BMaXN0KVxuICAgIGxpc3Q6IExvb3BMaXN0ID0gbnVsbFxuXG4gICAgQHByb3BlcnR5KCBUb3VjaGFibGUpXG4gICAgYWRkOiBUb3VjaGFibGUgPSBudWxsXG5cbiAgICBAcHJvcGVydHkoIFRvdWNoYWJsZSlcbiAgICBzdWJzdHJhY3Q6IFRvdWNoYWJsZSA9IG51bGxcblxuICAgIEBwcm9wZXJ0eSggVG91Y2hhYmxlKVxuICAgIHNob3dGcmlzdDogVG91Y2hhYmxlID0gbnVsbFxuXG4gICAgQHByb3BlcnR5KCBUb3VjaGFibGUpXG4gICAgc2hvd01pZDogVG91Y2hhYmxlID0gbnVsbFxuXG4gICAgQHByb3BlcnR5KCBUb3VjaGFibGUpXG4gICAgc2hvd0xhc3Q6IFRvdWNoYWJsZSA9IG51bGxcblxuICAgIEBwcm9wZXJ0eSggY2MuSW50ZWdlcilcbiAgICBhbW91bnQ6IG51bWJlciA9IDEwXG5cbiAgICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwXG5cbiAgICBzdGFydCAoKSB7XG5cbiAgICAgICAgdGhpcy5saXN0LmluaXRpYWxpemUoIHRoaXMub25DcmVhdGVJdGVtLmJpbmQodGhpcykpXG4gICAgICAgIFxuICAgICAgICB0aGlzLmFkZC5jbGlja2VkID0gKCk9PntcbiAgICAgICAgICAgIHRoaXMuY291bnQgKz0gdGhpcy5hbW91bnRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcInNldCBpdGVtIGNvdW50OlwiLCB0aGlzLmNvdW50KVxuICAgICAgICAgICAgdGhpcy5saXN0LnNldEl0ZW1Db3VudCggdGhpcy5jb3VudClcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zdWJzdHJhY3QuY2xpY2tlZCA9ICgpPT57XG4gICAgICAgICAgICB0aGlzLmNvdW50IC09IHRoaXMuYW1vdW50XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJzZXQgaXRlbSBjb3VudDpcIiwgdGhpcy5jb3VudClcbiAgICAgICAgICAgIHRoaXMubGlzdC5zZXRJdGVtQ291bnQoIHRoaXMuY291bnQpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2hvd0ZyaXN0LmNsaWNrZWQgPSAoKT0+e1xuICAgICAgICAgICAgdGhpcy5saXN0LnNob3dJdGVtKCAwLCB0cnVlKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNob3dNaWQuY2xpY2tlZCA9ICgpPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJzaG93IGl0ZW06XCIsIE1hdGguZmxvb3IoIHRoaXMuY291bnQgLyAyKSlcbiAgICAgICAgICAgIHRoaXMubGlzdC5zaG93SXRlbSggTWF0aC5mbG9vciggdGhpcy5jb3VudCAvIDIpKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNob3dMYXN0LmNsaWNrZWQgPSAoKT0+e1xuICAgICAgICAgICAgdGhpcy5saXN0LnNob3dJdGVtKCB0aGlzLmNvdW50IC0gMSwgdHJ1ZSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uQ3JlYXRlSXRlbSggbGlzdDogTG9vcExpc3QsIGlkeDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke3RoaXMubmFtZX0gc2hvdyBpZHg6ICR7aWR4fWApXG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5saXN0LmdldE5ld0l0ZW0oKVxuICAgICAgICBpdGVtLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYHRoaXNcXG5pc1xcbiR7aWR4fWBcbiAgICAgICAgbGV0IHRvdWNoYWJsZSA9IGl0ZW0uZ2V0Q29tcG9uZW50KCBUb3VjaGFibGUpXG4gICAgICAgIGlmKCB0b3VjaGFibGUgJiYgdG91Y2hhYmxlLmNsaWNrZWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgdG91Y2hhYmxlLmNsaWNrZWQgPSAoKT0+e1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBgb24gY2xpY2tlZDogJHtpdGVtLml0ZW1JZHh9YClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpdGVtXG4gICAgfVxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9XG59XG4iXX0=