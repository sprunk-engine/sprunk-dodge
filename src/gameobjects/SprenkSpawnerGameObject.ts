import { GameObject, Inject } from "sprunk-engine";

import { GameState } from "../models/GameState.ts";
import { DodgeGameManagerLogicBehavior } from "../behaviors/dodge/DodgeGameManagerLogicBehavior.ts";
import { AcceleratingEmitterLogicBehavior } from "../behaviors/logic/AcceleratingEmitterLogicBehavior.ts";
import { SprenkSpawnerLogicBehavior } from "../behaviors/dodge/SprenkSpawnerLogicBehavior.ts";

/**
 * Game object responsible for spawning pipes
 */
export class SprenkSpawnerGameObject extends GameObject {
    @Inject(DodgeGameManagerLogicBehavior, true)
    private _gameManager!: DodgeGameManagerLogicBehavior;

    private _intervalEmitter: AcceleratingEmitterLogicBehavior | null = null;

    protected onEnable() {
        super.onEnable();

        this._intervalEmitter = new AcceleratingEmitterLogicBehavior(2, 0.97, 0.4);
        this.addBehavior(this._intervalEmitter);

        const sprenkSpawnerLogicBehavior = new SprenkSpawnerLogicBehavior();
        this.addBehavior(sprenkSpawnerLogicBehavior);

        this._intervalEmitter.onDataChanged.addObserver(() => {
            sprenkSpawnerLogicBehavior.tryToSpawnSprenk();
        });

        // Connect to game manager to reset acceleration when game starts
        this._gameManager.onGameStateChange.addObserver(this.onGameStateChange.bind(this));
    }

    /**
     * Handle game state changes
     */
    private onGameStateChange(state: GameState): void {
        if (state === GameState.PLAYING && this._intervalEmitter) {
            // Reset emitter acceleration when game starts
            this._intervalEmitter.resetAcceleration();
        }
    }
} 