import {LogicBehavior, Vector2, Inject, PolygonCollider, Rigidbody, Event} from "sprunk-engine";
import { DodgeGameManagerLogicBehavior } from "./DodgeGameManagerLogicBehavior";

/**
 * Bird physics and behavior logic
 */
export class DodgerLogicBehavior extends LogicBehavior<void> {
    
    public onPhysicsEnabled: Event<Rigidbody> = new Event();
    @Inject(DodgeGameManagerLogicBehavior, true)
    private _gameManager!: DodgeGameManagerLogicBehavior;
    @Inject(PolygonCollider)
    private _collider!: PolygonCollider;

    private _jumpForce: number = 175;
    private _physicsEnabled: boolean = false;

    @Inject(Rigidbody, true)
    private _rigidbody: Rigidbody | null = null;


    protected onEnable() {
        super.onEnable();

        this._gameManager.dodgerTransform = this.gameObject.transform;

    }

    public tick(): void {
        if (!this._physicsEnabled || !this._gameManager.isGamePlaying()) return;
    }

    /**
     * Make the bird flap upwards using physics force
     */
    public jump(): void {
        this._gameManager.wantToStart();
        
        if (!this._gameManager.isGamePlaying()) return;
        
        if (this._rigidbody) {
            this._rigidbody.linearVelocity = new Vector2(0, 0);
            this._rigidbody.addForce(new Vector2(0, this._jumpForce));
            this._rigidbody.step(0.016, new Vector2(0, -9.81));
        }
    }

    public moveDown(): void {
        if (!this._gameManager.isGamePlaying()) return;

        if (this._rigidbody) {
            this._rigidbody.linearVelocity = new Vector2(0, -5);
            this._rigidbody.step(0.016, new Vector2(0, -9.81));
        }
    }

    public moveLeft(): void {
        if (!this._gameManager.isGamePlaying()) return;
        if (this._rigidbody) {
            this._rigidbody.linearVelocity = new Vector2(-5, this._rigidbody.linearVelocity.y);
            this._rigidbody.step(0.016, new Vector2(0, -9.81));
        }
    }

    public moveRight(): void {
        if (!this._gameManager.isGamePlaying()) return;
        if (this._rigidbody) {
            this._rigidbody.linearVelocity = new Vector2(5, this._rigidbody.linearVelocity.y);
            this._rigidbody.step(0.016, new Vector2(0, -9.81));
        }
    }
} 