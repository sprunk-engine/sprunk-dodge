import { Collider, GameObject, PolygonCollider, SpriteRenderBehavior, Vector2 } from "sprunk-engine";

/**
 * The ground for Dodger
 */
export class GroundGameObject extends GameObject {
    private _collider: Collider | null = null;

    constructor() {
        super("Ground");
    }

    protected onEnable() {
        super.onEnable();
        
        // Add ground sprite renderer
        this.addBehavior(
            new SpriteRenderBehavior("/assets/sprites/ground.png")
        );
        
        // Scale the ground to cover the width of the screen

        this.transform.scale.set(10, 1, 1);
        this.transform.position.set(0, -4, 0);

        // Add a horizontal with a height of 0.1 collider
        const groundVertices = [
            new Vector2(-5, -0.5),
            new Vector2(5, -0.5),
            new Vector2(5, 0.5),
            new Vector2(-5, 0.5),
        ];

        this._collider = new PolygonCollider(groundVertices);
        this.addBehavior(this._collider);
    }
}