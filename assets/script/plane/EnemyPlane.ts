import { _decorator, BoxCollider, Component, ITriggerEvent, Node, Vec3 } from 'cc';
import { GameManager } from '../framework/GameManager';
import { Constant, OUTOFBOUNCE } from '../framework/Constant';
import { PoolManager } from '../framework/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property
    public createBulletTime: number = 0.5;

    private _enemySpeed: number = 0;
    private _needBullet: boolean = false;
    private _gameManager: GameManager = null;

    private _curCreateBulletTime: number = 0;

    public enemyType = Constant.EnemyType.TYPE1;

    onEnable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable(): void {
        const collider = this.getComponent(BoxCollider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    update(deltaTime: number): void {
        const pos: Vec3 = this.node.position;
        const movePos: number = pos.x - this._enemySpeed * 0.1;
        this.node.setPosition(movePos, pos.y, pos.z);

        if (this._needBullet) {
            this._curCreateBulletTime += deltaTime;
            if (this._curCreateBulletTime > this.createBulletTime) {
                this._gameManager.createEnemyBullet(this.node.position);
                this._curCreateBulletTime = 0;
            }
        }

        if (movePos < -OUTOFBOUNCE) {
            PoolManager.instance().putNode(this.node);
        }
    }

    show(gameManager: GameManager, speed: number, needBullet: boolean): void {
        this._gameManager = gameManager;
        this._enemySpeed = speed;
        this._needBullet = needBullet;
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup();
        if (
            collisionGroup === Constant.CollisionType.SELF_PLANE ||
            collisionGroup === Constant.CollisionType.SELF_BULLET
        ) {
            this._gameManager.playAudioEffect('enemy');
            PoolManager.instance().putNode(this.node);
            this._gameManager.addScore();
            this._gameManager.createEnemyEffect(this.node.position);
        }
    }
}

