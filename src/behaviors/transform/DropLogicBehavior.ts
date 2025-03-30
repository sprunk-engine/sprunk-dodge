import { LogicBehavior, Vector2 } from "sprunk-engine";

export class DropLogicBehavior extends LogicBehavior<void> {
    protected _dropSpeed: Vector2;

    constructor(dropSpeed: Vector2) {
        super();
        this._dropSpeed = dropSpeed;
    }

    public tick(deltaTime: number): void {
        this.gameObject.transform.position.y -= this._dropSpeed.y * deltaTime;
    }
}