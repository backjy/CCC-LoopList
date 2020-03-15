import LoopListGrid from "./looplist/LoopListGrid";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class gridtest extends cc.Component {

    @property( LoopListGrid)
    gridview: LoopListGrid = null

    @property( LoopListGrid)
    hgridview: LoopListGrid = null

    start () {
        
        this.gridview.initialize( (view: LoopListGrid, idx: number)=>{
            let item = view.getNewItem()
            item.getComponent(cc.Label).string = `v item\n${idx}`
            return item
        })

        this.gridview.setItemCount( 200)

        this.hgridview.initialize( (view: LoopListGrid, idx: number)=>{
            let item = view.getNewItem()
            item.getComponent(cc.Label).string = `h item\n${idx}`
            return item
        })

        this.hgridview.setItemCount( 200)
    }

    // update (dt) {}
}
