import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
import { GameManager } from '../framework/GameManager';
import { PoolManager } from '../framework/PoolManager';
import { Constant, OUTOFBOUNCE } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('BulletProp')
export class BulletProp extends Component {
    private _propSpeed = 0.3;
    private _propYSpeed = 0.3;
    private _gameManager: GameManager = null;

    onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    start(): void {}

    update(deltaTime: number): void {
        let pos = this.node.position;
        if (pos.y >= 12) {
            this._propYSpeed = this._propSpeed;
        } else if (pos.y <= -12) {
            this._propYSpeed = -this._propSpeed;
        }

        this.node.setPosition(pos.x + this._propSpeed, pos.y + this._propYSpeed, pos.z);

        pos = this.node.position;
        if (pos.x < -OUTOFBOUNCE) {
            PoolManager.instance().putNode(this.node);
        }
    }

    show(gameManager: GameManager, speed: number): void {
        this._gameManager = gameManager;
        this._propSpeed = speed;
    }

    private _onTriggerEnter(event: ITriggerEvent): void {
        const name = event.selfCollider.node.name;
        if (name === 'bulletH') {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_H);
        } else if (name === 'bulletS') {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_S);
        } else {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M);
        }

        PoolManager.instance().putNode(this.node);
    }
}

