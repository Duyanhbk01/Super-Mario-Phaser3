import { Enemy } from './enemy';
import { ISpriteConstructor } from '../interfaces/sprite.interface';
import { Mario } from './mario';
import { GameScene } from '../scenes/game-scene';

export class Meteorite extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
  public scene: GameScene;

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene,aParams.x,aParams.y,aParams.texture);
    this.scene.add.existing(this)
    this.setActive(true)
    this.setVisible(true)
    this.displayHeight = 25;
    this.displayWidth = 20;
 }


  update(): void {
    if( (this.scene.player.x >= this.x - 50)&&(this.scene.player.y > this.y)){
        // console.log(this)
        this.scene.physics.world.enable(this);
        this.body.setSize(25,25,true);
        this.body.setVelocityY(200);
    }
    if(this.y > this.scene.sys.canvas.height){
        this.isDead();
    }
  }
  public isDead(): void {
    this.destroy();
  }
}
