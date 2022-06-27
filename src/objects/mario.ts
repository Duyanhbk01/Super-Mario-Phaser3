import { ISpriteConstructor } from '../interfaces/sprite.interface';
import marioFire from './marioFire';

export class Mario extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;

  // variables
  private currentScene: Phaser.Scene;
  public marioSize: string;
  private acceleration: number;
  private isJumping: boolean;
  private isDying: boolean;
  private isVulnerable: boolean;
  private vulnerableCounter: number;
  public inProcessFlash: boolean=false; /// warning
  private inProcess: boolean=false;
  private isFire: boolean=true;
  public playerFire: Phaser.GameObjects.Group;

  // input
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys;
  }

  public getVulnerable(): boolean {
    return this.isVulnerable;
  }

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.currentScene = aParams.scene;
    this.initSprite();
    this.playerFire = this.scene.add.group({
      /*classType: Collectible,*/
      runChildUpdate: true
    });
    this.currentScene.add.existing(this);

  }

  private initSprite() {
    // variables
    this.marioSize = this.currentScene.registry.get('marioSize');
    this.acceleration = 500;
    this.isJumping = false;
    this.isDying = false;
    this.isVulnerable = true;
    this.vulnerableCounter = 100;

    // sprite
    this.setOrigin(0, 0);
    this.setFlipX(false);

    // input
    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['DOWN', this.addKey('DOWN')],
      ['JUMP', this.addKey('SPACE')],
      ['UP', this.addKey('UP')]
    ]);

    // physics
    this.currentScene.physics.world.enable(this);
    this.adjustPhysicBodyToSmallSize();
    this.body.maxVelocity.x = 100;
    this.body.maxVelocity.y = 300;
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.currentScene.input.keyboard.addKey(key);
  }

  update(inProcess:boolean): void {
    // this.playerFire.getChildren().forEach((fire: marioFire) =>{fire.fire(this.x,this.y,this)})
    this.inProcess = inProcess;
    if(inProcess){
      this.visible = false;
      this.scene.physics.world.disable(this);
    }
    else{
      this.scene.physics.world.enable(this);
      this.visible = true;
      if(this.marioSize == 'big'){
        this.adjustPhysicBodyToBigSize();
      }
      else{
        this.adjustPhysicBodyToSmallSize();
      }
    }
    if (!this.isDying) {
      this.handleInput();
      this.handleAnimations();
    } else {
      this.setFrame(11);
      if (this.y > this.currentScene.sys.canvas.height) {
        this.currentScene.scene.stop('GameScene');
        this.currentScene.scene.stop('HUDScene');
        this.currentScene.scene.start('MenuScene');
      }
    }
    if (!this.isVulnerable) {
      if (this.vulnerableCounter > 0) {
        this.vulnerableCounter -= 1;
      } else {
        this.vulnerableCounter = 100;
        this.isVulnerable = true;
      }
    }
  }

  private handleInput() {
    if(this.isFire == true) {
      if(this.keys.get('UP').isDown){
        this.isFire = false;
        var data;
        this.playerFire.add( data = new marioFire(this.scene,"kame",this));
        this.scene.add.existing(data);
        data.fire(this);
        
      }
    }
    if(this.isFire == false){
      if(this.keys.get('UP').isUp){
        this.isFire = true;
      }
    }
    if (this.y > this.currentScene.sys.canvas.height) {
      // mario fell into a hole
      this.isDying = true;
    }

    // evaluate if player is on the floor or on object
    // if neither of that, set the player to be jumping
    if (
      this.body.onFloor() ||
      this.body.touching.down ||
      this.body.blocked.down
    ) {
      this.isJumping = false;
      //this.body.setVelocityY(0);
    }

    // handle movements to left and right
    if (this.keys.get('RIGHT').isDown) {
      this.body.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    } else if (this.keys.get('LEFT').isDown) {
      this.body.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    } else {
      this.body.setVelocityX(0);
      this.body.setAccelerationX(0);
    }

    // handle jumping
    if (this.keys.get('JUMP').isDown && !this.isJumping) {
      this.body.setVelocityY(-280);
      this.isJumping = true;
    }
  }

  private handleAnimations(): void {
    if (this.body.velocity.y !== 0) {
      // mario is jumping or falling
      // console.log(this.marioSize)
      this.anims.stop();
      if (this.marioSize === 'small') {
        this.setFrame(4);
      } else {
        this.setFrame(4);
      }
    } else if (this.body.velocity.x !== 0) {
      // mario is moving horizontal

      // check if mario is making a quick direction change
      if (
        (this.body.velocity.x < 0 && this.body.acceleration.x > 0) ||
        (this.body.velocity.x > 0 && this.body.acceleration.x < 0)
      ) {
        if (this.marioSize === 'small') {
          this.setFrame(5);
        } else {
          this.setFrame(5);
        }
      }

      if (this.body.velocity.x > 0) {
        this.anims.play(this.marioSize + 'MarioWalk', true);
      } else {
        this.anims.play(this.marioSize + 'MarioWalk', true);
      }
    } else {
      if(this.isFire==false){
        this.setFrame(13);
      }
      else{
        this.anims.stop();
        if (this.marioSize === 'small') {
          this.setFrame(0);
        } else {
            this.setFrame(0);
        }
      }
    }
    if(this.inProcessFlash == true){
      /// set farme sieu saidan

        if (this.keys.get('DOWN').isDown && this.inProcess==false ) {
        this.setFrame(6);
        if(this.flipX){
              this.body.setOffset(-25, 3);
          this.x -= 25;
        }
        else {
          this.body.setOffset(25, 3);
          this.x += 25;
        }
        this.setFrame(7);
      }
    }
  }

  public growMario(): void {
    this.marioSize = 'big';
    this.currentScene.registry.set('marioSize', 'big');
    this.adjustPhysicBodyToBigSize();
  }

  private shrinkMario(): void {
    this.marioSize = 'small';
    this.currentScene.registry.set('marioSize', 'small');
    this.adjustPhysicBodyToSmallSize();
  }

  private adjustPhysicBodyToSmallSize(): void {
    this.body.setSize(32, 48,false);
    this.body.setOffset(2, 3);
    this.displayHeight = 58;
    this.displayWidth = 36;

  }

  private adjustPhysicBodyToBigSize(): void {
    this.displayHeight = 68;
    this.displayWidth = 46;
    this.body.setSize(32, 48, false);
    this.body.setOffset(2, 3);

  }

  public bounceUpAfterHitEnemyOnHead(): void {
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 5 },
      duration: 200,
      ease: 'Power1',
      yoyo: true
    });
  }

  public gotHit(): void {
    this.isVulnerable = false;
    if (this.marioSize === 'big') {
      this.shrinkMario();
    } else {
      // mario is dying
      this.isDying = true;
      this.scene.cameras.main.flash(500,255,0,0)
      // sets acceleration, velocity and speed to zero
      // stop all animations
      this.body.stop();
      this.anims.stop();

      // make last dead jump and turn off collision check
      this.body.setVelocityY(-180);

      // this.body.checkCollision.none did not work for me
      this.body.checkCollision.up = false;
      this.body.checkCollision.down = false;
      this.body.checkCollision.left = false;
      this.body.checkCollision.right = false;
    }
  }
}
