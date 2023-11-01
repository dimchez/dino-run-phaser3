import * as Phaser from 'phaser';
import { GameEvent, GameScene } from '../types';

export class GameOverScene extends Phaser.Scene {
  private container: Phaser.GameObjects.Container;

  private restart: Phaser.GameObjects.Image;

  constructor() {
    super(GameScene.GameOver);
  }

  create() {
    const { height, width } = this.game.config;

    const canvasHeight = Number(height);
    const canvasWidth = Number(width);

    this.container = this.add.container(canvasWidth / 2, canvasHeight / 2 - 50);
    const gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 80, 'restart').setInteractive();

    this.container.add([gameOverText, this.restart]);

    this.handleInput();
  }

  handleInput() {
    this.restart.on('pointerdown', () => {
      this.scene.stop();
      this.game.events.emit(GameEvent.Restart);
    });
  }
}
