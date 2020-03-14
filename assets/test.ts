import LoopList from "./looplist/LoopList";
import Touchable from "./looplist/Touchable";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class test extends cc.Component {

    @property( LoopList)
    list: LoopList = null

    @property( Touchable)
    add: Touchable = null

    @property( Touchable)
    substract: Touchable = null

    @property( Touchable)
    showFrist: Touchable = null

    @property( Touchable)
    showMid: Touchable = null

    @property( Touchable)
    showLast: Touchable = null

    @property( cc.Integer)
    amount: number = 10

    private count: number = 0

    start () {

        this.list.initialize( this.onCreateItem.bind(this))
        
        this.add.clicked = ()=>{
            this.count += this.amount
            console.log( "set item count:", this.count)
            this.list.setItemCount( this.count)
        }
        
        this.substract.clicked = ()=>{
            this.count -= this.amount
            console.log( "set item count:", this.count)
            this.list.setItemCount( this.count)
        }
        
        this.showFrist.clicked = ()=>{
            this.list.showItem( 0, true)
        }
        
        this.showMid.clicked = ()=>{
            console.log( "show item:", Math.floor( this.count / 2))
            this.list.showItem( Math.floor( this.count / 2))
        }
        
        this.showLast.clicked = ()=>{
            this.list.showItem( this.count - 1, true)
        }
    }

    onCreateItem( list: LoopList, idx: number) {
        console.log(`${this.name} show idx: ${idx}`)
        let item = this.list.getNewItem()
        item.getComponent(cc.Label).string = `this\nis\n${idx}`
        let touchable = item.getComponent( Touchable)
        if( touchable && touchable.clicked == null) {
            touchable.clicked = ()=>{
                console.log( `on clicked: ${item.itemIdx}`)
            }
        }

        return item
    }
    // update (dt) {}
}
