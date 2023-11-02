import * as Phaser from 'phaser';
import { GameEvent, UpdateScoreEvent } from '../types';

const TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  color: '#535353',
  fontSize: 20,
  fontFamily: 'Courier',
  resolution: 5,
};

const toScoreString = (value: number) => `${value}`.padStart(5, '0');

export class ScoreBoard {
  private scene: Phaser.Scene;

  private scoreText: Phaser.GameObjects.Text;

  private highScoreText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    this.scoreText = scene.add
      .text(x, y, toScoreString(0), TEXT_STYLE)
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = scene.add
      .text(x, y, toScoreString(0), TEXT_STYLE)
      .setOrigin(1, 0)
      .setAlpha(0);

    scene.events.on(GameEvent.Achievement, this.#onAchievement, this);
    scene.events.on(GameEvent.Started, this.#onStart, this);
    scene.events.on(GameEvent.UpdateScore, this.#onUpdateScore, this);
    scene.game.events.on(GameEvent.Restart, this.#onRestart, this);
  }

  #onStart() {
    this.scoreText.setAlpha(1);
  }

  #onRestart() {
    this.scoreText.setText(toScoreString(0));
  }

  #onUpdateScore({ score, highScore }: UpdateScoreEvent) {
    this.#updateScore(score);

    if (highScore) {
      this.#updateHighScore(highScore);
    }
  }

  #onAchievement() {
    this.scene.tweens.add({
      targets: this.scoreText,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0,
    });
  }

  #updateScore(score: number) {
    this.scoreText.setText(toScoreString(score));
  }

  #updateHighScore(highScore: number) {
    this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;
    this.highScoreText.setText(`HI ${toScoreString(highScore)}`);
    this.highScoreText.setAlpha(1);
  }
}
