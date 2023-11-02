import * as Phaser from 'phaser';

const WIDTH = 20;

const HEIGHT = 40;

const FIRST_FRAME_KEY = 7;

const RIGHT_HALF_LAST_FRAME = 4;

const LEFT_HALF_FIRST_FRAME = 3;

const LAST_FRAME_KEY = 0;

const Y_POS = 80;

const X_OFFSET = 20;

export class Moon {
  private rightHalf: Phaser.GameObjects.TileSprite;

  private leftHalf: Phaser.GameObjects.TileSprite;

  private frameKey: number;

  constructor(scene: Phaser.Scene) {
    const { width } = scene.game.config;
    const canvasWidth = Number(width);

    this.rightHalf = scene.add
      .tileSprite(
        canvasWidth - 60,
        Y_POS,
        WIDTH,
        HEIGHT,
        'moon',
        FIRST_FRAME_KEY
      )
      .setOrigin(0, 1)
      .setVisible(false)
      .setDepth(1);

    this.leftHalf = scene.add
      .tileSprite(
        canvasWidth - 80,
        Y_POS,
        WIDTH,
        HEIGHT,
        'moon',
        LEFT_HALF_FIRST_FRAME
      )
      .setOrigin(0, 1)
      .setVisible(false)
      .setDepth(1);

    this.frameKey = FIRST_FRAME_KEY;
  }

  spawn() {
    if (this.frameKey === LAST_FRAME_KEY) {
      if (this.leftHalf.x <= WIDTH) {
        this.#resetMoonPosition();
      }

      return;
    }

    this.rightHalf.setX(this.rightHalf.x - X_OFFSET);
    this.leftHalf.setX(this.leftHalf.x - X_OFFSET);

    if (this.frameKey > RIGHT_HALF_LAST_FRAME) {
      this.rightHalf.setFrame(this.frameKey);
      this.rightHalf.setVisible(true);
    } else if (this.frameKey === RIGHT_HALF_LAST_FRAME) {
      this.rightHalf.setFrame(this.frameKey);
      this.rightHalf.setVisible(true);
      this.leftHalf.setVisible(true);
    } else if (this.frameKey < LEFT_HALF_FIRST_FRAME) {
      this.leftHalf.setFrame(this.frameKey);
      this.leftHalf.setVisible(true);
    }
  }

  reset() {
    this.leftHalf.setVisible(false);
    this.rightHalf.setVisible(false);

    if (this.frameKey === LAST_FRAME_KEY) {
      this.frameKey = FIRST_FRAME_KEY;
    } else if (this.frameKey === RIGHT_HALF_LAST_FRAME) {
      this.frameKey = LEFT_HALF_FIRST_FRAME - 1;
    } else {
      this.frameKey -= 1;
    }
  }

  #resetMoonPosition() {
    const { width } = this.leftHalf.scene.game.config;
    const canvasWidth = Number(width);

    this.leftHalf.setX(canvasWidth - 80);
    this.rightHalf.setX(canvasWidth - 60);
  }
}
