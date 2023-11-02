import * as Phaser from 'phaser';
import { GameEvent } from '../../types';

const HEIGHT = 26;

const WIDTH = 88;

const INCREASE_WIDTH = 34;

export class Ground extends Phaser.GameObjects.TileSprite {
  private startEvent: Phaser.Time.TimerEvent;

  private canvasWidth: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, WIDTH, HEIGHT, 'ground');

    this.setOrigin(0, 1);

    const { width } = scene.game.config;
    this.canvasWidth = Number(width);

    scene.add.existing(this);
  }

  init() {
    this.startEvent = this.scene.time.addEvent({
      delay: 1000 / 60,
      loop: true,
      callbackScope: this,
      callback: this.#startEventCallback,
    });
  }

  update(gameSpeed: number) {
    this.tilePositionX += gameSpeed;
  }

  #startEventCallback() {
    if (this.width < this.canvasWidth) {
      this.width += INCREASE_WIDTH;
    } else {
      this.width = this.canvasWidth;
      this.scene.events.emit(GameEvent.Started);
      this.startEvent.remove();
    }
  }
}
