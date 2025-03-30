import { Inject, LogicBehavior, PolygonCollider } from "sprunk-engine";
import { DodgeGameManagerLogicBehavior } from "./DodgeGameManagerLogicBehavior";


// Dropping
export class SprenkLogicBehavior extends LogicBehavior<void> {
  @Inject(DodgeGameManagerLogicBehavior, true)
  private _gameManager!: DodgeGameManagerLogicBehavior;
  @Inject(PolygonCollider)
  private _collider!: PolygonCollider;


  constructor() {
    super();
    
    this._collider.onDataChanged.addObserver(() =>
      this._gameManager.gameOver()
    );
  }

  public tick(deltaTime: number): void {
    super.tick(deltaTime);
    
    if (this.gameObject.transform.position.y > -10) {
      this.gameObject.destroy();
      this._gameManager.increaseScore();
      return;
    }
  }
}