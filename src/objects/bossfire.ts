import { Boss } from "./boss";

export default class bossFire extends Phaser.Physics.Arcade.Sprite {
    private boss : Boss;
    body: Phaser.Physics.Arcade.Body;
    constructor(scene : Phaser.Scene, key:any,boss : Boss) {
      super(scene, boss.x+10, boss.y+30, key )
      this.setScale(1)
    }
  
    fire ( boss: Boss) {
      this.scene.physics.world.enable(this);
      this.y = boss.y;
    //   this.body.setOffset(x + 10,y - 30);

        if(boss.flipX){
        this.x = boss.x+30;
        }
        else{
            this.x = boss.x+70;
        }
    if(boss.flipX){
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