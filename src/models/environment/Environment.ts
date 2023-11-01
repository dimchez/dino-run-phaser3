import * as Phaser from 'phaser';
import { GameEvent } from '../../types';
import { Clouds } from './Clouds';
import { Stars } from './Stars';
import { Ground } from './Ground';
import { Moon } from './Moon';
import {
  ENABLE_NIGHTMODE_ACHIEVEMENT_COUNT,
  DISABLE_NIGHTMODE_ACHIEVEMENT_COUNT,
} from '../../config';

export class Environment {
  private scene: Phaser.Scene;

  private clouds: Clouds;

  private ground: Ground;

  private moon: Moon;

  private stars: Stars;

  private achievementCount: number;

  private nightModeEnabled: boolean;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const { height } = scene.game.config;

    const canvasHeight = Number(height);

    this.ground = new Ground(scene, 0, canvasHeight);
    this.clouds = new Clouds(scene);
    this.moon = new Moon(scene);
    this.stars = new Stars(scene);

    this.achievementCount = 0;
    this.nightModeEnabled = false;

    scene.events.on(GameEvent.Starting, this.#onGameStarting, this);
    scene.events.on(GameEvent.Started, this.#onGameStarted, this);
    scene.events.on(GameEvent.Achievement, this.#onAchievement, this);
    scene.events.on(GameEvent.Restart, this.#onRestart, this);

    scene.game.canvas.style.transition = 'filter 500ms linear';
    scene.game.scale.parent.style.transition = 'background-color 500ms linear';
  }

  update(gameSpeed: number) {
    this.ground.update(gameSpeed);

    if (this.nightModeEnabled) {
      this.stars.update();
    } else {
      this.clouds.update();
    }
  }

  #onAchievement() {
    this.achievementCount += 1;

    if (this.#shouldEnableNightMode()) {
      this.#enableNightMode();
    } else if (this.#shouldDisableNightMode()) {
      this.#disableNightMode();
    }
  }

  #onGameStarting() {
    this.ground.init();
  }

  #onGameStarted() {
    this.achievementCount = 0;
    this.clouds.spawn();
  }

  #onRestart() {
    this.achievementCount = 0;
  }

  #enableNightMode() {
    this.achievementCount = 0;
    this.nightModeEnabled = true;

    this.scene.game.canvas.style.filter = 'invert(1)';
    this.scene.game.scale.parent.style.backgroundColor = '#222222';

    this.clouds.reset();
    this.stars.spawn();
    this.moon.spawn();
  }

  #disableNightMode() {
    this.achievementCount = 0;
    this.nightModeEnabled = false;

    this.scene.game.canvas.style.filter = 'invert(0)';
    this.scene.game.scale.parent.style.backgroundColor = '#FFFFFF';

    this.stars.reset();
    this.moon.reset();
    this.clouds.spawn();
  }

  #shouldEnableNightMode() {
    return (
      !this.nightModeEnabled &&
      this.achievementCount === ENABLE_NIGHTMODE_ACHIEVEMENT_COUNT
    );
  }

  #shouldDisableNightMode() {
    return (
      this.nightModeEnabled &&
      this.achievementCount === DISABLE_NIGHTMODE_ACHIEVEMENT_COUNT
    );
  }
}
