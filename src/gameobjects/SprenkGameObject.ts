import { GameObject, SpriteRenderBehavior, PolygonCollider, Vector2, Rigidbody } from "sprunk-engine";

export class SprenkGameObject extends GameObject {
    private static readonly RADIUS = 0.5; // Radius of the sprenk
    private _collider: PolygonCollider | null = null;
    private _rigidbody: Rigidbody | null = null;


    constructor() {
        super("Sprenk");
    }

    protected onEnable() {
        super.onEnable();
        // square collider
        let sprenkVertices = [
            new Vector2(-SprenkGameObject.RADIUS, -SprenkGameObject.RADIUS),
            new Vector2(SprenkGameObject.RADIUS, -SprenkGameObject.RADIUS),
            new Vector2(SprenkGameObject.RADIUS, SprenkGameObject.RADIUS),
            new Vector2(-SprenkGameObject.RADIUS, SprenkGameObject.RADIUS)
        ];

        this._collider = new PolygonCollider(sprenkVertices);
        this._rigidbody = new Rigidbody(this._collider, 1);

        this.addBehavior(this._collider);
        this.addBehavior(this._rigidbody);

        this._rigidbody.linearVelocity = new Vector2(0, -5);
        this.transform.position.set(
            0,
            20,
            0
        );

        // Add sprenk sprite renderer
        this.addBehavior(new SpriteRenderBehavior("/assets/sprites/sprenk.png"));
        // Scale the sprenk to fit the radius
        this.transform.scale.set(SprenkGameObject.RADIUS * 2, SprenkGameObject.RADIUS * 2, 1);

    }
}