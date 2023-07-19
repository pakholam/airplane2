import { _decorator, Animation, BoxCollider, Component, Label, macro, math, Node, Prefab, Vec3 } from 'cc';
import { SelfPlane } from '../plane/SelfPlane';
import { Constant, OUTOFBOUNCE } from './Constant';
import { PoolManager } from './PoolManager';
import { Bullet } from '../bullet/Bullet';
import { EnemyPlane } from '../plane/EnemyPlane';
import { BulletProp } from '../bullet/BulletProp';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(SelfPlane)
    public playerPlane: SelfPlane = null;

    @property(Prefab)
    public bullet01: Prefab = null;
    @property(Prefab)
    public bullet02: Prefab = null;
    @property(Prefab)
    public bullet03: Prefab = null;
    @property(Prefab)
    public bullet04: Prefab = null;
    @property(Prefab)
    public bullet05: Prefab = null;
    @property
    public shootTime: number = 0.1;
    @property
    public bulletSpeed: number = 1;
    @property(Node)
    public bulletRoot: Node = null;

    @property(Prefab)
    public enemy01: Prefab = null;
    @property(Prefab)
    public enemy02: Prefab = null;
    @property(Prefab)
    public enemy03: Prefab = null;
    @property
    public createEnemyTime: number = 1;
    @property
    public enemy01Speed: number = 0;
    @property
    public enemy02Speed: number = 0;
    @property
    public enemy03Speed: number = 0;

    @property(Prefab)
    public enemyExplode: Prefab = null;

    @property(Prefab)
    public bulletPropM: Prefab = null;
    @property(Prefab)
    public bulletPropH: Prefab = null;
    @property(Prefab)
    public bulletPropS: Prefab = null;
    @property
    public bulletPropSpeed: number = 0.3;

    @property(Node)
    public gamePage: Node = null;
    @property(Node)
    public gameOverPage: Node = null;
    @property(Label)
    public gameScore: Label = null;
    @property(Label)
    public gameOverScore: Label = null;
    @property(Animation)
    public overAnim: Animation = null;

    @property(AudioManager)
    public audioEffect: AudioManager = null;

    public isGameStart = false;

    private _currShootTime: number = 0;
    private _isShooting: boolean = false;
    private _currCreateEnemyTime: number = 0;
    private _combinationInterval: number = Constant.Combination.PLAN1;
    private _bulletType = Constant.BulletPropType.BULLET_M;
    private _score = 0;

    start() {
        this._init();
    }

    update(deltaTime: number) {
        if (!this.isGameStart) {
            return;
        }

        if (this.playerPlane.isDie) {
            this.gameOver();
            return;
        }

        this._currShootTime += deltaTime;

        if (this._isShooting && this._currShootTime > this.shootTime) {
            if (this._bulletType === Constant.BulletPropType.BULLET_H) {
                this.createPlayerBulletH();
            } else if (this._bulletType === Constant.BulletPropType.BULLET_S) {
                this.createPlayerBulletS();
            } else {
                this.createPlayerBulletM();
            }

            const name = 'bullet' + ((this._bulletType % 2) + 1);
            this.playAudioEffect(name);

            this._currShootTime = 0;
        }

        this._currCreateEnemyTime += deltaTime;
        if (this._combinationInterval === Constant.Combination.PLAN1) {
            if (this._currCreateEnemyTime > this.createEnemyTime) {
                this.createEnemyPlane();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.Combination.PLAN2) {
            if (this._currCreateEnemyTime > this.createEnemyTime * 3) {
                const randomCombination = math.randomRangeInt(1, 3);
                randomCombination === Constant.Combination.PLAN2 ? this.createCombination1() : this.createEnemyPlane();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.Combination.PLAN3) {
            if (this._currCreateEnemyTime > this.createEnemyTime * 2) {
                const randomCombination = math.randomRangeInt(1, 5);
                randomCombination === Constant.Combination.PLAN3 ? this.createCombination2() : this.createEnemyPlane();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval > Constant.Combination.PLAN3) {
            this._combinationInterval = Constant.Combination.PLAN1;
        }
    }

    public returnMain(): void {
        this._resetGameData();
    }

    public gameStart(): void {
        this.isGameStart = true;
        this._changePlaneMode();
        this._score = 0;
        this.gameScore.string = this._score.toString();
        this.playerPlane.init();
    }

    public gameRestart(): void {
        this.gameStart();
        this._resetGameData();
    }

    public gameOver(): void {
        this.isGameStart = false;
        this.gameOverPage.active = true;
        this.gameOverScore.string = this._score.toString();
        this.overAnim.play();
        this._isShooting = false;
        this.unschedule(this._modeChanged);
        this._destoryAll();
    }

    public addScore(): void {
        this._score++;
        this.gameScore.string = this._score.toString();
    }

    public createPlayerBulletM(): void {
        const bullet = PoolManager.instance().getNode(this.bullet05, this.bulletRoot);
        const pos = this.playerPlane.node.position;
        bullet.setPosition(pos.x + 5, pos.y + 1, pos.z);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false);
    }

    public createPlayerBulletH(): void {
        const pos = this.playerPlane.node.position;

        // letf
        const bullet1 = PoolManager.instance().getNode(this.bullet01, this.bulletRoot);
        bullet1.setPosition(pos.x, pos.y + 1.5, pos.z);
        const bulletComp1 = bullet1.getComponent(Bullet);
        bulletComp1.show(this.bulletSpeed, false);

        // right
        const bullet2 = PoolManager.instance().getNode(this.bullet01, this.bulletRoot);
        bullet2.setPosition(pos.x, pos.y - 1.5, pos.z);
        const bulletComp2 = bullet2.getComponent(Bullet);
        bulletComp2.show(this.bulletSpeed, false);
    }

    public createPlayerBulletS(): void {
        const pos = this.playerPlane.node.position;

        // middle
        const bullet = PoolManager.instance().getNode(this.bullet03, this.bulletRoot);
        bullet.setPosition(pos.x + 5, pos.y, pos.z);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, false);

        // left
        const bullet1 = PoolManager.instance().getNode(this.bullet03, this.bulletRoot);
        bullet1.setPosition(pos.x + 1, pos.y + 2, pos.z);
        const bulletComp1 = bullet1.getComponent(Bullet);
        bulletComp1.show(this.bulletSpeed, false, Constant.Direction.LEFT);

        // right
        const bullet2 = PoolManager.instance().getNode(this.bullet03, this.bulletRoot);
        bullet2.setParent(this.bulletRoot);
        bullet2.setPosition(pos.x + 1, pos.y - 2, pos.z);
        const bulletComp2 = bullet2.getComponent(Bullet);
        bulletComp2.show(this.bulletSpeed, false, Constant.Direction.RIGHT);
    }

    public createEnemyBullet(targetPos: Vec3): void {
        const bullet = PoolManager.instance().getNode(this.bullet02, this.bulletRoot);
        bullet.setPosition(targetPos.x - 6, targetPos.y, targetPos.z);
        const bulletComp = bullet.getComponent(Bullet);
        bulletComp.show(this.bulletSpeed, true);

        const colliderComp = bullet.getComponent(BoxCollider);
        colliderComp.setGroup(Constant.CollisionType.ENEMY_BULLET);
        colliderComp.setMask(Constant.CollisionType.SELF_PLANE);
    }

    public createEnemyPlane(): void {
        let whichEnemy = math.randomRangeInt(1, 3);
        let prefab: Prefab = null;
        let speed: number = 0;
        switch (whichEnemy) {
            case Constant.EnemyType.TYPE1: {
                prefab = this.enemy01;
                speed = this.enemy01Speed;
                break;
            }
            case Constant.EnemyType.TYPE2: {
                prefab = this.enemy02;
                speed = this.enemy02Speed;
                break;
            }
            case Constant.EnemyType.TYPE3: {
                prefab = this.enemy03;
                speed = this.enemy03Speed;
                break;
            }
        }
        const enemy = PoolManager.instance().getNode(prefab, this.node);
        const enemyComp = enemy.getComponent(EnemyPlane);
        enemyComp.show(this, speed, true);
        const randomPos = math.randomRangeInt(12, -11);
        enemy.setPosition(30, randomPos, 0);
    }

    public createCombination1(): void {
        const enemyArray = new Array<Node>(5);
        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = PoolManager.instance().getNode(this.enemy01, this.node);
            const element: Node = enemyArray[i];
            element.setPosition(30, -11 + i * 5, 0);
            const enemyComp: EnemyPlane = element.getComponent(EnemyPlane);
            enemyComp.show(this, this.enemy01Speed, false);
        }
    }

    public createCombination2(): void {
        const enemyArray: Node[] = new Array<Node>(7);
        const compList: Prefab[] = [this.enemy01, this.enemy02, this.enemy03];
        // prettier-ignore
        const combinationPos: number[] = [
            45, 9, 0,
            40, 6, 0,
            35, 2, 0,
            30, -1, 0,
            35, -4, 0,
            40, -8, 0,
            45, -11, 0,
        ];

        for (let i = 0; i < enemyArray.length; i++) {
            enemyArray[i] = PoolManager.instance().getNode(compList[(i + 1) % 3], this.node);
            const element: Node = enemyArray[i];
            const startIndex: number = i * 3;
            element.setPosition(
                combinationPos[startIndex],
                combinationPos[startIndex + 1],
                combinationPos[startIndex + 2]
            );
            const enemyComp: EnemyPlane = element.getComponent(EnemyPlane);
            enemyComp.show(this, this.enemy02Speed, false);
        }
    }

    public createEnemyEffect(pos: Vec3): void {
        const effect: Node = PoolManager.instance().getNode(this.enemyExplode, this.node);
        effect.setPosition(pos);
    }

    public createBulletProp(): void {
        const randomProp = math.randomRangeInt(1, 4);
        let prefab: Prefab = null;
        if (randomProp === Constant.BulletPropType.BULLET_H) {
            prefab = this.bulletPropH;
        } else if (randomProp === Constant.BulletPropType.BULLET_M) {
            prefab = this.bulletPropM;
        } else {
            prefab = this.bulletPropM;
        }

        const prop = PoolManager.instance().getNode(prefab, this.node);
        prop.setPosition(OUTOFBOUNCE, 12, 0);
        const propComp: BulletProp = prop.getComponent(BulletProp);
        propComp.show(this, -this.bulletPropSpeed);
    }

    public isShooting(value: boolean): void {
        this._isShooting = value;
    }

    public changeBulletType(type: number): void {
        this._bulletType = type;
    }

    public playAudioEffect(name: string): void {
        this.audioEffect.play(name);
    }

    private _init(): void {
        this._currShootTime = this.shootTime;
        this.playerPlane.init();
    }

    private _resetGameData(): void {
        this._currShootTime = 0;
        this._currCreateEnemyTime = 0;
        this._combinationInterval = Constant.Combination.PLAN1;
        this._bulletType = Constant.BulletPropType.BULLET_M;
        this.playerPlane.node.setPosition(-10, 0, 0);
    }

    private _changePlaneMode(): void {
        this.schedule(this._modeChanged, 10, macro.REPEAT_FOREVER);
    }

    private _modeChanged(): void {
        this._combinationInterval++;
        this.createBulletProp();
    }

    private _destoryAll(): void {
        let children = this.node.children;
        let length = children.length;
        let i = 0;
        for (i = length - 1; i >= 0; i--) {
            const child = children[i];
            PoolManager.instance().putNode(child);
        }

        children = this.bulletRoot.children;
        length = children.length;
        for (i = length - 1; i >= 0; i--) {
            const child = children[i];
            PoolManager.instance().putNode(child);
        }
    }
}

