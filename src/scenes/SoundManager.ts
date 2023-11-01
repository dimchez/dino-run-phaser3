import * as Phaser from 'phaser';
import { GameEvent } from '../types';

export class SoundManager {
  private achievementSound: Phaser.Sound.BaseSound;

  private gameOverSound: Phaser.Sound.BaseSound;

  private playerActionSound: Phaser.Sound.BaseSound;

  private playerActionSoundPaused: boolean;

  constructor(scene: Phaser.Scene) {
    this.playerActionSound = scene.sound.add('jump', { volume: 0.5 });
    this.gameOverSound = scene.sound.add('hit', { volume: 0.5 });
    this.achievementSound = scene.sound.add('reach', { volume: 0.5 });

    this.playerActionSoundPaused = false;

    this.initEventListeners(scene);
  }

  private initEventListeners(scene: Phaser.Scene) {
    scene.events.on(GameEvent.Achievement, this.#onAchievement, this);
    scene.events.on(GameEvent.Collide, this.#onCollide, this);
    scene.events.on(GameEvent.PlayerAction, this.#onPlayerAction, this);
    scene.game.events.on(GameEvent.Restart, this.#onRestart, this);
  }

  #onAchievement() {
    this.achievementSound.play();
  }

  #onCollide() {
    this.gameOverSound.play();

    this.playerActionSoundPaused = true;
  }

  #onPlayerAction() {
    if (this.playerActionSoundPaused) {
      return;
    }

    this.playerActionSound.play();
  }

  #onRestart() {
    this.playerActionSoundPaused = false;
  }
}
