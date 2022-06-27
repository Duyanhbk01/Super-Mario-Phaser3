import { Mario } from "./mario";

export default class marioFire extends Phaser.Physics.Arcade.Sprite {
    private mario : Mario;
    body: Phaser.Physics.Arcade.Body;
    constructor(scene : Phaser.Scene, key:any,mario : Mario) {
      super(scene, mario.x+10, mario.y+30, key )
      this.setScale(0.2)
    }
  
    fire ( mario: Mario) {
      this.scene.physics.world.enable(this);
      this.y = mario.y +25;
    //   this.body.setOffset(x + 10,y - 30);

    if(mario.marioSize =='big'){
        this.setScale(0.5)
        if(mario.flipX){
        this.x = mario.x;
        }
        else{
            this.x = mario.x+50;
        }
    }
    else{
        if(mario.flipX){
            this.x = mario.x;
        }
        else{
            this.x = mario.x + 30;
        }
        this.setScale(0.2)
    }
    if(mario.flipX){
        this.setFlipX(true)
        this.setVelocityY(-100)
        this.setVelocityX(-200)
        this.setAccelerationX(-500)
    }
    else{
        this.setVelocityY(-100)
        this.setVelocityX(+200)
        this.setAccelerationX(+500)
    }
    this.setActive(true)
    this.setVisible(true)
    }
    stopfire() {
      // this.play("boom")
      this.setActive(false)
      this.setVisible(false)
      
      this.setVelocityX(0)
      this.scene.physics.world.disable(this);
    }
  
    preUpdate() {
      if (this.x > this.scene.sys.canvas.width) {
        // this.play("boom")
        this.stop()
      }
    }
  }