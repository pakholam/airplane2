import { _decorator, Component, EventTouch, Input, Node } from 'cc';
import { GameManager } from '../framework/GameManager';
import { SelfPlane } from '../plane/SelfPlane';
import { JoyStick } from './JoyStick';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property(Node)
    public shootBtn: Node = null;

    @property(GameManager)
    public gameManager: GameManager = null;

    @property(Node)
    public gameStart: Node = null;

    @property(Node)
    public game: Node = null;

    @property(Node)
    public gameOver: Node = null;

    start(): void {
        this.shootBtn.on(Input.EventType.TOUCH_START, this._touchStart, this);
        this.shootBtn.on(Input.EventType.TOUCH_CANCEL, this._touchEnd, this);
        this.shootBtn.on(Input.EventType.TOUCH_END, this._touchEnd, this);
        this.gameStart.active = true;
    }

    update(deltaTime: number): void {}

    public startGame(): void {
        this.gameStart.active = false;
        this.gameManager.playAudioEffect('button');
        this.gameManager.gameStart();
    }

    public reStart(): void {
        this.gameOver.active = false;
        this.gameManager.playAudioEffect('button');
        this.gameManager.gameRestart();
    }

    public returnMain(): void {
        this.gameOver.active = false;
        this.gameStart.active = true;
        this.gameManager.playAudioEffect('button');
        this.gameManager.returnMain();
    }

    _touchStart(touch: Touch, event: EventTouch) {
        if (this.gameManager.isGameStart) {
            this.gameManager.isShooting(true);
        }
    }

    _touchEnd(touch: Touch, event: EventTouch) {
        if (!this.gameManager.isGameStart) {
            return;
        }
        this.gameManager.isShooting(false);
    }
}

