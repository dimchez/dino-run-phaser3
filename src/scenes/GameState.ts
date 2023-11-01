import * as Phaser from 'phaser';
import { GameEvent } from '../types';
import {
  INITIAL_GAME_SPEED,
  GAME_SPEED_INCREMENT,
  ACHIEVEMENT_SCORE,
} from '../config';

const TEN_TIMES_PER_SECOND = 1000 / 10;

const isAchievement = (score: number): boolean =>
  score % ACHIEVEMENT_SCORE === 0;

export class GameState {
  private scene: Phaser.Scene;

  private speedUpdateTimer: Phaser.Time.TimerEvent;

  private speed: number;

  private started: boolean;

  private score: number;

  private highScore: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.speed = INITIAL_GAME_SPEED;

    this.score = 0;
    this.highScore = 0;

    scene.events.on(GameEvent.Started, this.#onGameStarted, this);
    scene.events.on(GameEvent.Collide, this.#onCollide, this);

    scene.game.events.on(GameEvent.Restart, this.#onRestart, this);
  }

  get isGameStarted() {
    return this.started;
  }

  get gameSpeed() {
    return this.speed;
  }

  #onGameStarted() {
    this.started = true;

    this.speedUpdateTimer = this.scene.time.addEvent({
      delay: TEN_TIMES_PER_SECOND,
      loop: true,
      callbackScope: this,
      callback: this.#increaseGameSpeed,
    });
  }

  #onCollide() {
    this.started = false;
    this.speedUpdateTimer.remove();

    if (this.score > this.highScore) {
      this.highScore = this.score;

      this.scene.events.emit(GameEvent.UpdateScore, {
        highScore: this.highScore,
        score: this.score,
      });
    }
  }

  #onRestart() {
    this.score = 0;
    this.speed = INITIAL_GAME_SPEED;
    this.#onGameStarted();
  }

  #increaseGameSpeed() {
    this.speed += GAME_SPEED_INCREMENT;
    this.score += 1;

    this.scene.events.emit(GameEvent.UpdateScore, { score: this.score });

    if (isAchievement(this.score)) {
      this.scene.events.emit(GameEvent.Achievement);
    }
  }
}
