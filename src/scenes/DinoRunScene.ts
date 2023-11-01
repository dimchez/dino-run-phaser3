import * as Phaser from 'phaser';
import { GameEvent, GameScene } from '../types';
import { Environment, Player, ScoreBoard, StartTrigger } from '../models';
import { SoundManager } from './SoundManager';
import { Obsticles } from '../models/Obsticles';
import { GameState } from './GameState';

export class DinoRunScene extends Phaser.Scene {
  private gameState: GameState;

  private startTrigger: StartTrigger;

  private player: Player;

  private scoreBoard: ScoreBoard;

  private obsticles: Obsticles;

  private environment: Environment;

  private soundManager: SoundManager;

  constructor() {
    super(GameScene.DinoRun);
  }

  create() {
    const { height, width } = this.game.config;

    const canvasHeight = Number(height);
    const canvasWidth = Number(width);

    this.player = new Player(this, 0, canvasHeight);
    this.player.init(this.physics, this.anims);

    this.startTrigger = new StartTrigger(this, this.player);

    this.scoreBoard = new ScoreBoard(this, canvasWidth, 0);

    this.environment = new Environment(this);

    this.obsticles = new Obsticles(this, this.player);

    this.soundManager = new SoundManager(this);

    this.gameState = new GameState(this);

    this.#initAnimations();

    this.events.on(GameEvent.Collide, this.#onCollide, this);
    this.game.events.on(GameEvent.Restart, this.#onRestart, this);
  }

  update(time: number, delta: number) {
    if (!this.gameState.isGameStarted) {
      return;
    }

    this.player.update();
    this.obsticles.update(this.gameState.gameSpeed, delta);
    this.environment.update(this.gameState.gameSpeed);
  }

  #initAnimations() {
    this.anims.create({
      key: 'enemy-bird',
      frames: this.anims.generateFrameNames('enemy-bird', { start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  #onRestart() {
    this.physics.resume();
    this.anims.resumeAll();
  }

  #onCollide() {
    this.physics.pause();
    this.anims.pauseAll();

    this.scene.launch(GameScene.GameOver);
  }
}
