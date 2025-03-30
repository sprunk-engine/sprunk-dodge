import { DeviceInputBehavior, Inject } from "sprunk-engine";
import { DodgerLogicBehavior } from "./DodgerLogicBehavior";

/**
 * Input behavior for controlling the dodger game object.
 * This behavior listens for keyboard input and sends commands to the logic behavior.
 * It allows the player to move left, right, and jump using the arrow keys or WASD keys.
 */
export class DodgerInputBehavior extends DeviceInputBehavior {
    @Inject(DodgerLogicBehavior)
    private _logic!: DodgerLogicBehavior;
    
    public override onKeyboardKeyDown(key: string): void {
        if (!this._logic) { // Space bar key
            return;
        }
        if (key == "a" || key === "ArrowLeft") {
            this._logic.moveLeft();
        }
        if (key == "d" || key === "ArrowRight") {
            this._logic.moveRight();
        }
        if (key == "w" || key === "ArrowUp" || key == " ") {
            console.log("Jumping");
            this._logic.jump();
        }
        if (key == "s" || key === "ArrowDown") {
            this._logic.moveDown();
        }
    }
} 