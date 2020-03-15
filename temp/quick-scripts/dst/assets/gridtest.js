
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/gridtest.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9ncmlkdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0RBQW1EO0FBRW5ELG9CQUFvQjtBQUNwQix3RUFBd0U7QUFDeEUsbUJBQW1CO0FBQ25CLGtGQUFrRjtBQUNsRiw4QkFBOEI7QUFDOUIsa0ZBQWtGO0FBRTVFLElBQUEsa0JBQW1DLEVBQWxDLG9CQUFPLEVBQUUsc0JBQXlCLENBQUM7QUFHMUM7SUFBc0MsNEJBQVk7SUFEbEQ7UUFBQSxxRUE2QkM7UUF6QkcsY0FBUSxHQUFpQixJQUFJLENBQUE7UUFHN0IsZUFBUyxHQUFpQixJQUFJLENBQUE7O1FBcUI5QixpQkFBaUI7SUFDckIsQ0FBQztJQXBCRyx3QkFBSyxHQUFMO1FBRUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUUsVUFBQyxJQUFrQixFQUFFLEdBQVc7WUFDdEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxhQUFXLEdBQUssQ0FBQTtZQUNyRCxPQUFPLElBQUksQ0FBQTtRQUNmLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUUsR0FBRyxDQUFDLENBQUE7UUFFaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUUsVUFBQyxJQUFrQixFQUFFLEdBQVc7WUFDdkQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxhQUFXLEdBQUssQ0FBQTtZQUNyRCxPQUFPLElBQUksQ0FBQTtRQUNmLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUUsR0FBRyxDQUFDLENBQUE7SUFDckMsQ0FBQztJQXRCRDtRQURDLFFBQVEsQ0FBRSxzQkFBWSxDQUFDOzhDQUNLO0lBRzdCO1FBREMsUUFBUSxDQUFFLHNCQUFZLENBQUM7K0NBQ007SUFOYixRQUFRO1FBRDVCLE9BQU87T0FDYSxRQUFRLENBNEI1QjtJQUFELGVBQUM7Q0E1QkQsQUE0QkMsQ0E1QnFDLEVBQUUsQ0FBQyxTQUFTLEdBNEJqRDtrQkE1Qm9CLFFBQVEiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTG9vcExpc3RHcmlkIGZyb20gXCIuL2xvb3BsaXN0L0xvb3BMaXN0R3JpZFwiO1xuXG4vLyBMZWFybiBUeXBlU2NyaXB0OlxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvdHlwZXNjcmlwdC5odG1sXG4vLyBMZWFybiBBdHRyaWJ1dGU6XG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcblxuY29uc3Qge2NjY2xhc3MsIHByb3BlcnR5fSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBncmlkdGVzdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG5cbiAgICBAcHJvcGVydHkoIExvb3BMaXN0R3JpZClcbiAgICBncmlkdmlldzogTG9vcExpc3RHcmlkID0gbnVsbFxuXG4gICAgQHByb3BlcnR5KCBMb29wTGlzdEdyaWQpXG4gICAgaGdyaWR2aWV3OiBMb29wTGlzdEdyaWQgPSBudWxsXG5cbiAgICBzdGFydCAoKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyaWR2aWV3LmluaXRpYWxpemUoICh2aWV3OiBMb29wTGlzdEdyaWQsIGlkeDogbnVtYmVyKT0+e1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB2aWV3LmdldE5ld0l0ZW0oKVxuICAgICAgICAgICAgaXRlbS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGB2IGl0ZW1cXG4ke2lkeH1gXG4gICAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuZ3JpZHZpZXcuc2V0SXRlbUNvdW50KCAyMDApXG5cbiAgICAgICAgdGhpcy5oZ3JpZHZpZXcuaW5pdGlhbGl6ZSggKHZpZXc6IExvb3BMaXN0R3JpZCwgaWR4OiBudW1iZXIpPT57XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHZpZXcuZ2V0TmV3SXRlbSgpXG4gICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gYGggaXRlbVxcbiR7aWR4fWBcbiAgICAgICAgICAgIHJldHVybiBpdGVtXG4gICAgICAgIH0pXG5cbiAgICAgICAgdGhpcy5oZ3JpZHZpZXcuc2V0SXRlbUNvdW50KCAyMDApXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIChkdCkge31cbn1cbiJdfQ==