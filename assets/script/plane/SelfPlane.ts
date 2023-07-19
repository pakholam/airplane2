import { _decorator, AudioSource, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
import { Constant } from '../framework/Constant';
import { JoyStick } from '../ui/JoyStick';
const { ccclass, property } = _decorator;

const OUTOFWIDTH = 24;
const OUTOFHEIGHT = 12;
@ccclass('SelfPlane')
export class SelfPlane extends Component {
    @property(Node)
    public explode: Node = null;

    @property(Node)
    public bloodFace: Node = null;

    @property(Node)
    public blood: Node = null;

    @property
    public planeSpeed: number = 1;

    public lifeValue: number = 10;
    public isDie: boolean = false;

    private _currLife: number = 0;
    private _audioSource: AudioSource = null;

    start(): void {
        this._audioSource = this.getComponent(AudioSource);
    }

    onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    public init(): void {
        this.node.active = true;
        this._currLife = this.lifeValue;
        this.isDie = false;
        this.explode.active = false;
        this.bloodFace.setScale(1, 1, 1);
    }

    update(deltaTime: number) {
        if (!this.isDie) {
            this.updatePlayerPlanePosition();
        }
    }

    public updatePlayerPlanePosition() {
        let dir = JoyStick.ins.dir;
        dir = dir.normalize();
        const speedX = dir.x * this.planeSpeed * 0.1;
        const speedY = dir.y * this.planeSpeed * 0.1;
        const pos = this.node.position;
        // this.playerPlane.angle = JoyStick.ins.calculateAngle();

        this.node.setPosition(
            pos.x + speedX > OUTOFWIDTH || pos.x + speedX < -OUTOFWIDTH ? pos.x : pos.x + speedX,
            pos.y + speedY > OUTOFHEIGHT || pos.y + speedY < -OUTOFHEIGHT ? pos.y : pos.y + speedY,
            0
        );
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (
            collisionGroup === Constant.CollisionType.ENEMY_PLANE ||
            collisionGroup === Constant.CollisionType.ENEMY_BULLET
        ) {
            if (this._currLife === this.lifeValue) {
                this.blood.active = true;
            }
            this._currLife--;
            this.bloodFace.setScale(this._currLife / this.lifeValue, 1, 1);
            if (this._currLife <= 0) {
                this.isDie = true;
                this._audioSource.play();
                this.explode.active = true;
                this.blood.active = false;
            }
        }
    }
}

