import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import bossFire from './bossfire';

export class Boss extends Enemy {
  body: Phaser.Physics.Arcade.Body;
  hp: number = 10000;
  hpText :Phaser.GameObjects.Text;
  public bossFire: Phaser.GameObjects.Group;
  constructor(aParams: ISpriteConstructor) {
    super(aParams);
    this.speed = -60;
    this.dyingScoreValue = 100;
    this.body.setSize(80,100);
    this.bossFire = this.scene.add.group({
      /*classType: Brick,*/
      runChildUpdate: true
    }); 
    this.hpText = this.scene.add.text(this.x + 30,this.y+60, this.hp.toString()
    ,{color: "#fff"})
  }
  checkDie(){
    if(this.hp==0){
      this.isDying = true;
      this.hpText.text = "You Win!";
      this.scene.tweens.add({
        targets: this.scene, 
        ease: "Power1",
        duration: 2000,
        onComplete: ()=>{
          this.scene.scene.start('MenuScene');
          
        }
      })
    }
  }
  invertSpeed(){
    this.speed = -this.speed;
    this.body.velocity.x = this.speed;
  }
  update(): void {
    this.checkDie();
    if (!this.isDying) {
      if (this.isActivated) {
        this.hpText.x  = this.x+ 30;
        this.hpText.text = this.hp.toString();
        var random =  Phaser.Math.Between(0,20);
        if(random==0){
          var data;
          this.bossFire.add( data = new bossFire(this.scene,"fireboss",this));
          this.scene.add.existing(data);
          data.fire(this);
        }
        if(this.body.velocity.x < 0){
          this.setFlipX(true);
        }
        else{
          this.setFlipX(false);
        }
        // goomba is still alive
        // add speed to velocity x
        this.body.setVelocityX(this.speed);

        // if goomba is moving into obstacle from map layer, turn
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed;
          this.body.velocity.x = this.speed;
        }

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
    this.body.setVelocityX(60);
    this.body.setVelocityY(-60);
    this.setFlipY(true);
  }

  public isDead(): void {
    this.destroy();
  }
}
