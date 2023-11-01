import * as Phaser from 'phaser';

const MAX_STARS = 5;

export class Stars extends Phaser.GameObjects.Group {
  private canvasWidth: number;

  constructor(scene: Phaser.Scene) {
    super(scene);

    const { width } = scene.game.config;

    this.canvasWidth = Number(width);

    this.setVisible(false);
  }

  spawn() {
    const xWidth = this.canvasWidth / MAX_STARS;
    const stars = [];

    for (let i = 0; i < MAX_STARS; i++) {
      stars.push(this.#placeImage(xWidth, i));
    }

    this.addMultiple(stars);
    this.setVisible(true);
  }

  reset() {
    this.clear(true, true);
    this.setVisible(false);
  }

  update() {
    Phaser.Actions.IncX(this.getChildren(), -0.05);

    this.getChildren().forEach((star: Phaser.GameObjects.Image) =>
      this.#updatePosition(star)
    );
  }

  #placeImage(width: number, index: number) {
    return this.scene.add.image(
      Phaser.Math.Between(width * index, width * (index + 1)),
      Phaser.Math.Between(40, 180),
      'star',
      Phaser.Math.Between(0, 2)
    );
  }

  #updatePosition(star: Phaser.GameObjects.Image) {
    if (star.getBounds().right < 0) {
      star.x = this.canvasWidth + 10;
      star.y = Phaser.Math.Between(40, 180);
    }
  }
}
