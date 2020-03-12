import LoopList from "./LoopList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoopListItem extends cc.Component {
    /// item start offset
    @property( cc.Float)
    private startOffset: number = 0
    /// item padding
    @property( cc.Float)
    padding: number = 0
    /// item cache key
    public itemKey: string = null
    /// record item offset 
    private _offset: number = 0
    get offset(){ return this._offset }
    /// item index
    private _idx: number = -1
    set itemIdx( value: number) {
        /// set idx 的时候直接设置好对应的 offset 避免get 的时候再做if 判断
        this._offset = (value === 0)? this.startOffset: 0
        this._idx = value
    }
    get itemIdx() { return this._idx}
    
    /// current loop list
    looplist: LoopList = null 

    onEnable() { this.node.on( cc.Node.EventType.SIZE_CHANGED, this.onSizeChanged, this) }

    onDisable() { this.node.off( cc.Node.EventType.SIZE_CHANGED, this.onSizeChanged, this) }

    private onSizeChanged() {
        if( this.looplist) {  this.looplist.itemSizeChanged() }
    }
}