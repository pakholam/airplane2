import { _decorator, Component, EventTouch, Node, NodeEventType, UITransform, v2, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends Component {
    public static ins: JoyStick = null;

    @property(Node)
    public joyStickBg: Node = null;

    @property(Node)
    public joyStickDot: Node = null;

    public UITf_dot: UITransform = null;
    public maxLength: number = 0;
    private _dir: Vec2 = new Vec2(0, 0);

    public get dir(): Vec2 {
        return this._dir;
    }

    public set dir(value: Vec2) {
        this._dir = value;
    }

    planeAngle: number = 0;

    onLoad(): void {
        if (JoyStick.ins == null) {
            JoyStick.ins = this;
        }
        this.init();
    }

    init() {
        this.UITf_dot = this.joyStickBg.getComponent(UITransform);
        this.maxLength = this.joyStickBg.getComponent(UITransform).width / 2;

        this.joyStickBg.on(NodeEventType.TOUCH_START, this.onTouchMove, this);
        this.joyStickBg.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.joyStickBg.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.joyStickBg.on(NodeEventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    public calculateAngle() {
        if (this.dir.x == 0 && this.dir.y == 0) return this.planeAngle;
        // 计算单位向量相对于正右方向的角度（以弧度表示）
        let angleRad = Math.atan2(this.dir.y, this.dir.x);
        // 将弧度转换为角度（以度数表示）
        this.planeAngle = (angleRad * 180) / Math.PI;
        return this.planeAngle;
    }

    private onTouchMove(event: EventTouch) {
        // 获取世界坐标
        let worldPos = event.getUILocation();
        // 摇杆点是bg的子节点，所以要转换成bg的局部坐标
        let localPos = this.UITf_dot.convertToNodeSpaceAR(v3(worldPos.x, worldPos.y, 0));
        let length = localPos.length();
        if (length > 0) {
            //  只计算方向
            this.dir.x = localPos.x / length;
            this.dir.y = localPos.y / length;
            // 计算最外一圈的x,y位置
            if (length > this.maxLength) {
                localPos.x = this.maxLength * this.dir.x;
                localPos.y = this.maxLength * this.dir.y;
            }
            this.joyStickDot.setPosition(localPos);
        }
    }

    private onTouchEnd(event: NodeEventType) {
        this.dir = v2(0, 0);
        this.joyStickDot.setPosition(0, 0, 0);
    }
}

