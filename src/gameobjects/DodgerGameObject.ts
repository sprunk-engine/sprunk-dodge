import { GameObject, PolygonCollider, Rigidbody, SpriteRenderBehavior, Vector2 } from "sprunk-engine";
import { DodgerLogicBehavior } from "../behaviors/dodge/DodgerLogicBehavior";
import { DodgerInputBehavior } from "../behaviors/dodge/DodgerInputBehavior";

export class DodgerGameObject extends GameObject{
    private _collider: PolygonCollider | null = null;
    private _rigidbody: Rigidbody | null = null;
    private _logicBehavior: DodgerLogicBehavior | null = null;

    protected onEnable(): void {
        super.onEnable();

        const dodgerVertices = [
            new Vector2(-0.5, -0.5),
            new Vector2(0.5, -0.5),
            new Vector2(0.5, 0.5),
            new Vector2(-0.5, 0.5),
        ]

        this._collider = new PolygonCollider(dodgerVertices);
        this.addBehavior(this._collider);

        this._rigidbody = new Rigidbody(this._collider);
        this.addBehavior(this._rigidbody);

        this._logicBehavior = new DodgerLogicBehavior();
        this.addBehavior(this._logicBehavior);

        this.addBehavior(new SpriteRenderBehavior("/assets/sprites/dodger.png"));

        this.addBehavior(new DodgerInputBehavior());

    }
}