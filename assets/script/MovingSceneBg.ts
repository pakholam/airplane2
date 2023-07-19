import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MovingSceneBg')
export class MovingSceneBg extends Component {
    @property(Node)
    bg01: Node = null;

    @property(Node)
    bg02: Node = null;

    private _bgSpeed = 4;
    private _bgMovingRange = -90;

    start() {}

    test() {
        this._init();
    }

    update(deltaTime: number) {
        this._moveBackground(deltaTime);
    }

    private _init() {
        this.bg01.setPosition(0, 0, 0);
        this.bg02.setPosition(this._bgMovingRange, 0, 0);
    }

    private _moveBackground(deltaTime: number) {
        this.bg01.setPosition(this.bg01.position.x - this._bgSpeed * deltaTime, 0, 0);
        this.bg02.setPosition(this.bg02.position.x - this._bgSpeed * deltaTime, 0, 0);

        if (this.bg01.position.x < this._bgMovingRange) {
            this.bg01.setPosition(this.bg02.position.x - this._bgMovingRange, 0, 0);
        } else if (this.bg02.position.x < this._bgMovingRange) {
            this.bg02.setPosition(this.bg01.position.x - this._bgMovingRange, 0, 0);
        }
    }
}

