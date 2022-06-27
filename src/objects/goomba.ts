import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Goomba extends Enemy {
  body: Phaser.Physics.Arcade.Body;

  constructor(aParams: ISpriteConstructor) {
    super(aParams);
    this.speed = -20;
    this.dyingScoreValue = 100;
    this.body.setSize(180,150,true);
    this.displayHeight = 30;
    this.displayWidth = 24;
    // this.body.setSize(60,80);
   
  }
  invertSpeed(){
    this.speed *=-1;
  }

  update(): void {
    if (!this.isDying) {
      if (this.isActivated) {
        if(this.y > 402){
          // this.body.setGravityY(0);
          var random =  Phaser.Math.Between(0,10);
          if(!random) {
            this.body.setVelocityY(-100);
          }
          // else{
          //   this.body.setVelocityY(100);
          // }
        }

        // goomba is still alive
        // add speed to velocity x
        this.body.setVelocityX(this.speed);

        // if goomba is moving into obstacle from map layer, turn
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
        }

        // apply walk animation
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
