import { Inject, LogicBehavior, Vector2 } from "sprunk-engine";
import { DodgeGameManagerLogicBehavior } from "./DodgeGameManagerLogicBehavior";
import { GameState } from "../../models/GameState";
import { SprenkGameObject } from "../../gameobjects/SprenkGameObject";

export class SprenkSpawnerLogicBehavior extends LogicBehavior<void> {
    @Inject(DodgeGameManagerLogicBehavior, true)
    private _gameManager!: DodgeGameManagerLogicBehavior;     
    
    protected onEnable(): void {
        super.onEnable();
        this._gameManager.onGameStateChange.addObserver(this.onGameStateChange.bind(this));
    }

    
    private onGameStateChange(state: GameState): void {
        if (state === GameState.PLAYING) {
            this.destroyAllSprenk();
        }
    }

    private destroyAllSprenk(): void {
        this.gameObject.children.forEach((child) => {
            if (child.name === "Sprenk") {
                child.destroy();
            }
        });
    }

    public tryToSpawnSprenk(): void {
        if (this._gameManager.isGamePlaying()) {
            this.spawnSprenk();
        }
    }

    private spawnSprenk(): void {
        const sprenk = new SprenkGameObject();
        this.gameObject.addChild(sprenk);
    }
}