export class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key;
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.startKey.isDown = false;
    this.initGlobalDataManager();
  }

  create(): void {

    this.add.image(0, 0, 'title').setOrigin(0, 0).setScale(1);
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 150,
        105,
        'font',
        'START',
        50
      )
    );
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 200,
        205,
        'font',
        'PRESS S',
        50
      )
    );
  }

  update(): void {
    if (this.startKey.isDown) {
      var level = this.registry.get('level')[5];
      this.registry.set('world', level);
      this.scene.start('HUDScene');
      this.scene.start('GameScene');
      this.scene.bringToTop('HUDScene');
    }

  }

  private initGlobalDataManager(): void {
    this.registry.set('time', 400);
    this.registry.set('level', 'level1');
    // this.registry.set('world', '1-1');
    this.registry.set('worldTime', 'WORLD TIME');
    this.registry.set('score', 0);
    this.registry.set('coins', 0);
    this.registry.set('lives', 2);
    this.registry.set('spawn', { x: 12, y: 44, dir: 'down' });
    this.registry.set('marioSize', 'small');
  }
}
