import { Camera, GameObject, PolygonCollider, TextRenderBehavior, Vector2 } from "sprunk-engine";
import { DodgeGameManagerLogicBehavior } from "../../behaviors/dodge/DodgeGameManagerLogicBehavior";
import { DodgerGameObject } from "../DodgerGameObject";
import { ScoreGameObject } from "../ScoreGameObject";
import { GameState } from "../../models/GameState";
import { GroundGameObject } from "../GroundGameObject";
import { SprenkSpawnerGameObject } from "../SprenkSpawnerGameObject";
import { FreeLookCameraController } from "../../behaviors/camera/FreeLookCameraController";
import { FreeLookCameraKeyboardMouseInput } from "../../behaviors/camera/FreeLookCameraKeyboardMouseInput";

export class DodgeScene extends GameObject {
    private _dodger: DodgerGameObject | null = null;
    private _gameManager: DodgeGameManagerLogicBehavior | null = null;
    private _startTexts: GameObject | null = null;
    private _gameOverText: GameObject | null = null;

    private static readonly BOUNDARY_WIDTH = 30; // Width of the boundary walls
    private static readonly BOUNDARY_HEIGHT = 1; // Height of the boundary colliders
    private static readonly GAME_HEIGHT = 4.35;    // Distance from center to top/bottom
    private static readonly GAME_OFFSET = 0.3;    // Distance from center to top/bottom

    protected onEnable(): void {
        super.onEnable();
    
        this.createBoundary("TopBoundary", DodgeScene.GAME_HEIGHT + DodgeScene.GAME_OFFSET, true);
        this.createBoundary("BottomBoundary", -DodgeScene.GAME_HEIGHT - DodgeScene.GAME_OFFSET, true);
        this.createBoundary("LeftBoundary", -DodgeScene.GAME_HEIGHT - DodgeScene.GAME_OFFSET, false);
        this.createBoundary("RightBoundary", DodgeScene.GAME_HEIGHT + DodgeScene.GAME_OFFSET, false);

        const cameraGo = new GameObject("Camera");
        this.addChild(cameraGo);
        cameraGo.addBehavior(new Camera());
        cameraGo.transform.position.set(0, 0, 10);
        //cameraGo.addBehavior(new FreeLookCameraController())
        //cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput());

        const scoreManager = new ScoreGameObject("ScoreManager");
        this.addChild(scoreManager);
        scoreManager.transform.position.set(0, 3, 0);

        this._gameManager = new DodgeGameManagerLogicBehavior(scoreManager.getLogic());
        this._gameManager.onGameStateChange.addObserver(this.onGameStateChange.bind(this));
        this.addBehavior(this._gameManager);

        this._dodger = new DodgerGameObject("Dodger");
        this.addChild(this._dodger);

        const ground = new GroundGameObject();
        this.addChild(ground);

        const sprenkSpawner = new SprenkSpawnerGameObject("SprenkSpawner");
        this.addChild(sprenkSpawner);

        this._startTexts = new GameObject("startTexts");
        this.addChild(this._startTexts);

        const titleGo = new GameObject("Title");
        this._startTexts.addChild(titleGo);
        titleGo.transform.position.set(0, 2, 0);

        const titleText = new TextRenderBehavior(
            "assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
            { centered: true, pixelScale: 1/64, color: [1, 0.8, 0, 1] }
        );
        titleGo.addBehavior(titleText);
        titleText.text = "Dodge the Sprenks!";

        const instructionsGo = new GameObject("Instructions");
        this._startTexts.addChild(instructionsGo);
        instructionsGo.transform.position.set(0, 0, 0);

        const instructionsText = new TextRenderBehavior(
            "assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
            { centered: true, pixelScale: 1/128, color: [1, 1, 1, 1] }
        );
        instructionsGo.addBehavior(instructionsText);
        instructionsText.text = "Press SPACE to jump and use WASD to move!";

        this.resetPositions();
    }


    private onGameStateChange(state: GameState): void {
        if (state === GameState.PLAYING) {
            this.resetPositions();
            this._startTexts?.destroy();
            this._gameOverText?.destroy();
        }
        if (state === GameState.GAMEOVER) {
            this.showGameOver();
        }
    }

    private resetPositions(): void {
        this._dodger?.transform.position.set(0, 0 , 0);
    }

    private showGameOver(): void {
        this._gameOverText = new GameObject("GameOverText");
        this.addChild(this._gameOverText);

        const gameOverGo = new GameObject("GameOver");
        this._gameOverText.addChild(gameOverGo);
        gameOverGo.transform.position.set(0, 1, 1);
        
        const gameOverText = new TextRenderBehavior(
            "assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json", 
            { centered: true, pixelScale: 1/64, color: [1, 0, 0, 1] }
        );
        gameOverGo.addBehavior(gameOverText);
        gameOverText.text = "GAME OVER";

        const restartGo = new GameObject("Restart");
        this._gameOverText.addChild(restartGo);
        restartGo.transform.position.set(0, 0, 1);

        const restartTexts = new TextRenderBehavior(
            "assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json",
            { centered: true, pixelScale: 1/128, color: [1, 1, 1, 1] }
        );
        restartTexts.text = "Flap to restart";
        restartGo.addBehavior(restartTexts);

    }

    /**
     * Creates a boundary collider at the specified position and orientation
     */
    private createBoundary(name: string, position: number, isHorizontal: boolean): void {
        const boundary = new GameObject(name);
        this.addChild(boundary);

        // Create wide but thin collider
        const boundaryVertices = isHorizontal
            ? [
                new Vector2(DodgeScene.BOUNDARY_WIDTH / 2, DodgeScene.BOUNDARY_HEIGHT / 2),
                new Vector2(DodgeScene.BOUNDARY_WIDTH / 2, -DodgeScene.BOUNDARY_HEIGHT / 2),
                new Vector2(-DodgeScene.BOUNDARY_WIDTH / 2, -DodgeScene.BOUNDARY_HEIGHT / 2),
                new Vector2(-DodgeScene.BOUNDARY_WIDTH / 2, DodgeScene.BOUNDARY_HEIGHT / 2),
            ]
            : [
                new Vector2(DodgeScene.BOUNDARY_HEIGHT / 2, DodgeScene.BOUNDARY_WIDTH / 2),
                new Vector2(DodgeScene.BOUNDARY_HEIGHT / 2, -DodgeScene.BOUNDARY_WIDTH / 2),
                new Vector2(-DodgeScene.BOUNDARY_HEIGHT / 2, -DodgeScene.BOUNDARY_WIDTH / 2),
                new Vector2(-DodgeScene.BOUNDARY_HEIGHT / 2, DodgeScene.BOUNDARY_WIDTH / 2),
            ];

        const collider = new PolygonCollider(boundaryVertices);
        boundary.addBehavior(collider);

        // Position the boundary
        if (isHorizontal) {
            boundary.transform.position.set(0, position, 0);
        } else {
            boundary.transform.position.set(position, 0, 0);
        }
    }
}