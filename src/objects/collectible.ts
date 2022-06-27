import { ICollectibleConstructor } from '../interfaces/collectible.interface';

export class Collectible extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private currentScene: Phaser.Scene;
  private points: number;

  constructor(aParams: ICollectibleConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    // variables
    this.currentScene = aParams.scene;
    this.points = aParams.points;
    this.initSprite();
    this.currentScene.add.existing(this);
    if(aParams.texture=="coin2"){
      this.anims.play("coin");
      this.displayHeight = 16;
      this.displayWidth = 16;
      this.body.setSize(70,70);
    }
    if(aParams.texture=="rotatingCoin"){
      this.anims.play("coin");
      this.displayHeight = 16;
      this.displayWidth = 16;
      this.currentScene.physics.world.disable(this)
    }
    if(aParams.texture=="flash"){
      this.displayHeight = 20;
      this.displayWidth = 20;
      this.body.setSize(150,150);
    }
  }

  private initSprite() {
    // sprite
    this.setOrigin(0, 0);
    this.setFrame(0);
    // this.anims.play("coin");

    // physics
    this.currentScene.physics.world.enable(this);
    this.body.setSize(16,16);
    this.body.setAllowGravity(false);
  }

  update(): void {}

  public collected(): void {
    this.destroy();
    this.currentScene.registry.values.score += this.points;
    this.currentScene.events.emit('scoreChanged');
  }
}
