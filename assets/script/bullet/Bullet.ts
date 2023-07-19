import { _decorator, BoxCollider, Component, ITriggerEvent, Node } from 'cc';
import { Constant, OUTOFBOUNCE } from '../framework/Constant';
import { PoolManager } from '../framework/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    private _bulletSpeed = 0;

    private _isEnemyBullet = false;

    private _direction = Constant.Direction.MIDDLE;

    onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on(`onTriggerEnter`, this._onTriggerEnter, this);
    }

    onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off(`onTriggerEnter`, this._onTriggerEnter, this);
    }

    update(deltaTime: number) {
        const pos = this.node.position;
        let moveLength = 0;
        if (this._isEnemyBullet) {
            moveLength = pos.x - this._bulletSpeed;

            this.node.setPosition(moveLength, pos.y, pos.z);
            if (moveLength < -OUTOFBOUNCE) {
                PoolManager.instance().putNode(this.node);
            }
        } else {
            moveLength = pos.x + this._bulletSpeed;
            if (this._direction === Constant.Direction.LEFT) {
                this.node.setPosition(moveLength, pos.y + this._bulletSpeed * 0.2, pos.z);
            } else if (this._direction === Constant.Direction.RIGHT) {
                this.node.setPosition(moveLength, pos.y - this._bulletSpeed * 0.2, pos.z);
            } else {
                this.node.setPosition(moveLength, pos.y, pos.z);
            }
            if (moveLength > OUTOFBOUNCE) {
                PoolManager.instance().putNode(this.node);
            }
        }
    }

    show(speed: number, isEnemyBullet: boolean, direction: number = Constant.Direction.MIDDLE) {
        this._bulletSpeed = speed;
        this._isEnemyBullet = isEnemyBullet;
        this._direction = direction;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        PoolManager.instance().putNode(this.node);
    }
}

