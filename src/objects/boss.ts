import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Boss extends Enemy {
  body: Phaser.Physics.Arcade.Body;
    public originX : number;
  constructor(aParams: ISpriteConstructor) {
    super(aParams);
    this.speed = -200;
    this.dyingScoreValue = 100;
    this.body.setSize(180,150,true);
    this.displayHeight = 30;
    this.displayWidth = 24;
    this.originX = this.x;
  }
  

  update(): void {
    if (!this.isDying) {
      if (this.isActivated) {
       
        this.body.setVelocityX(this.speed);
        
        this.anims.play('goombaWalk', true);
      } else {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.getBounds(),
            this.currentScene.cameras.main.worldView
          )
        ) {
          this.isActivated = true;
        }
      }
    } else {
      // goomba is dying, so stop animation, make velocity 0 and do not check collisions anymore
      this.anims.stop();
      this.body.setVelocity(0, 0);
      this.body.checkCollision.none = true;
    }
  }

  public gotHitOnHead(): void {
    this.isDying = true;
    this.setFrame(2);
    this.showAndAddScore();
  }
  
  protected gotHitFromBulletOrMarioHasStar(): void {
    this.isDying = true;
    this.body.setVelocityX(20);
    this.body.setVelocityY(-20);
    this.setFlipY(true);
  }

  public isDead(): void {
    this.destroy();
  }
}
