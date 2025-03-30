import {Event, LogicBehavior, Transform} from "sprunk-engine";
import { GameState } from "../../models/GameState";
import {ScoreLogicBehavior} from "../logic/ScoreLogicBehavior.ts";

/**
 * Game manager logic behavior
 * Responsible for managing the state of the game (start, in game, game over)
 * and delegating score additions
 */
export class DodgeGameManagerLogicBehavior extends LogicBehavior<void> {
    public onGameStateChange: Event<GameState> = new Event();
    public onSpeedChange: Event<number> = new Event();

    private _gameState: GameState = GameState.START;
    private _scoreManager: ScoreLogicBehavior | null = null;
    private _dodgerTransform: Transform | null = null;
    private _gameSpeed: number = 0;
    
    constructor(scoreManager: ScoreLogicBehavior) {
        super();
        this._scoreManager = scoreManager;
    }

    /**
     * Call when the dodger wants to Start.
     * Try to change the game state to perform the appropriate action.
     */
    public wantToStart(): void {
        if(this._gameState !== GameState.PLAYING) {
            this.startGame();
        }
    }

    /**
     * Increase the score
     */
    public increaseScore(): void {
        if (this._gameState === GameState.PLAYING && this._scoreManager) {
            this._scoreManager.increaseScore();
        }
    }

    /**
     * Get the current game state
     */
    public getGameState(): GameState {
        return this._gameState;
    }

    /**
     * Get the dodger transform
     */
    public get dodgerTransform(): Transform | null {
        return this._dodgerTransform;
    }

    /**
     * Set the dodger transform
     * @param value
     */
    public set dodgerTransform(value: Transform | null) {
        this._dodgerTransform = value;
    }

    /**
     * Check if the game is in progress
     */
    public isGamePlaying(): boolean {
        return this._gameState === GameState.PLAYING;
    }

    /**
     * Start the game
     */
    private startGame(): void {
        if (this._gameState === GameState.START || this._gameState === GameState.GAMEOVER) {
            this.changeGameState(GameState.PLAYING);
        }
    }
    
    /**
     * End the game and show game over
     */
    public gameOver(): void {
        if (this._gameState === GameState.PLAYING) {
            this.changeGameState(GameState.GAMEOVER);
        }
    }

    /**
     * Get the current game speed
     */
    public get gameSpeed(): number {
        return this._gameSpeed;
    }

    private setGameSpeed(speed: number): void {
        this._gameSpeed = speed;
        this.onSpeedChange.emit(speed);
    }

    private changeGameState(newState: GameState): void {
        if (newState === this._gameState) return;
        switch (newState)
        {
            case GameState.START:
                this.setGameSpeed(0);
                break;
            case GameState.PLAYING:
                this.setGameSpeed(5);
                this._scoreManager?.resetScore();
                break;
            case GameState.GAMEOVER:
                this.setGameSpeed(0);
                break;
        }
        this._gameState = newState;
        this.onGameStateChange.emit(newState);
    }
} 