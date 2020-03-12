


const {ccclass, property} = cc._decorator;

/// 点击间隔
const click_interval: number = 1

@ccclass
export default class Touchable extends cc.Component{
    @property( cc.Boolean)
    public interactable: boolean = true

    @property( cc.AudioClip)
    public audioClip: cc.AudioClip = null

    public clicked: ()=>void = null

    // private mark: number = 0

    onEnable(){
        this._registerNodeEvent()
    }

    onDisable(){
        this._unregisterNodeEvent()
    }
    
    /// on node event
    _registerNodeEvent () {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }
    
    _unregisterNodeEvent () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }

    private _pressed: boolean = false
    // touch event handler
    _onTouchBegan (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;
        this._pressed = true;
        event.stopPropagation();
        /// play audio clip
        if( this.audioClip) { cc.audioEngine.play( this.audioClip, false, 1) }
    }

    _onTouchMove (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
        event.stopPropagation();
    }

    _onTouchEnded (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;
        this._pressed = false;
        event.stopPropagation();
        if( this.clicked) { this.clicked()}
    }

    _onTouchCancel () {
        if (!this.interactable || !this.enabledInHierarchy) return;
        this._pressed = false;
    }
}