import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class Constant {
    public static EnemyType = {
        TYPE1: 1,
        TYPE2: 2,
        TYPE3: 3,
        TYPE4: 4,
        TYPE5: 5,
    };

    public static Combination = {
        PLAN1: 1,
        PLAN2: 2,
        PLAN3: 3,
    };

    public static CollisionType = {
        SELF_PLANE: 1 << 1,
        ENEMY_PLANE: 1 << 2,
        SELF_BULLET: 1 << 3,
        ENEMY_BULLET: 1 << 4,
        BULLET_PROP: 1 << 5,
    };

    public static BulletPropType = {
        BULLET_M: 1,
        BULLET_H: 2,
        BULLET_S: 3,
    };

    public static Direction = {
        LEFT: 1,
        MIDDLE: 2,
        RIGHT: 3,
    };
}

export const OUTOFBOUNCE: number = 30;

