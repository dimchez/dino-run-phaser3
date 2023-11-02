import * as Phaser from 'phaser';

const MAX_CLOUDS = 3;

export class Clouds extends Phaser.GameObjects.Group {
  private canvasWidth: number;

  constructor(scene: Phaser.Scene) {
    super(scene);

    const { width } = scene.game.config;

    this.canvasWidth = Number(width);

    this.setVisible(false);
  }

  spawn() {
    const xWidth = this.canvasWidth / MAX_CLOUDS;
    const clouds = [];

    for (let i = 0; i < MAX_CLOUDS; i++) {
      clouds.push(this.#placeImage(xWidth, i));
    }

    this.addMultiple(clouds);
    this.setVisible(true);
  }

  reset() {
    this.clear(true, true);
    this.setVisible(false);
  }

  update() {
    Phaser.Actions.IncX(this.getChildren(), -0.5);

    this.getChildren().forEach((cloud: Phaser.GameObjects.Image) =>
      this.#updatePosition(cloud)
    );
  }

  #placeImage(width: number, index: number) {
    return this.scene.add.image(
      Phaser.Math.Between(width * index, width * (index + 1)),
      Phaser.Math.Between(80, 180),
      'cloud'
    );
  }

  #updatePosition(cloud: Phaser.GameObjects.Image) {
    if (cloud.getBounds().right < 0) {
      cloud.x = this.canvasWidth + 30;
      cloud.y = Phaser.Math.Between(80, 180);
    }
  }
}
