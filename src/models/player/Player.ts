import * as Phaser from 'phaser';
import { GameEvent, PlayerAnimations, PlayerState } from '../../types';
import { PlayerInputManager } from './PlayerInputManager';
import {
  MIN_JUMP_VELOCITY,
  MAX_JUMP_VELOCITY,
  MIN_JUMP_KEY_PRESS_DURATION,
  MAX_JUMP_KEY_PRESS_DURATION,
  MIN_SPEED_INCREASE,
  MAX_SPEED_INCREASE,
} from '../../config';

const DINO_DOWN_HEIGHT = 58;

const DINO_HEIGHT = 92;

const DINO_BODY_WIDTH = 44;

export class Player extends Phaser.Physics.Arcade.Sprite {
  private inputManager: PlayerInputManager;

  private playerState: PlayerState;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerAnimations.Idle);

    this.setDepth(1);
    this.setOrigin(0, 1);

    this.scene.add.existing(this);

    this.inputManager = new PlayerInputManager(this);

    this.playerState = 'idle';
  }

  init(
    physics: Phaser.Physics.Arcade.ArcadePhysics,
    animationsManager: Phaser.Animations.AnimationManager
  ) {
    this.#initEventListeners();
    this.#initPhysics(physics);
    this.#initAnimations(animationsManager);
  }

  duck() {
    if (!this.isOnFloor || !this.isRunning) {
      return;
    }

    this.setBodySize(DINO_BODY_WIDTH, DINO_DOWN_HEIGHT);
    this.body.offset.y = DINO_HEIGHT - DINO_DOWN_HEIGHT;
  }

  jump() {
    if (
      !this.isOnFloor ||
      this.body.velocity.x > 0 ||
      this.playerState === 'hurt'
    ) {
      return;
    }

    this.scene.events.emit(GameEvent.PlayerAction);

    this.setBodySize(DINO_BODY_WIDTH, DINO_HEIGHT);
    this.setOffset(this.body.offset.x, 0);

    const velocityY = this.isRunning ? MIN_JUMP_VELOCITY : MAX_JUMP_VELOCITY;
    this.setVelocityY(velocityY);

    this.setTexture('dino', 0);
  }

  riseUp() {
    if (!this.isOnFloor || !this.isRunning) {
      return;
    }

    this.setBodySize(DINO_BODY_WIDTH, DINO_HEIGHT);
    this.setOffset(this.body.offset.x, 0);
  }

  update() {
    if (!this.isOnFloor) {
      const duration = this.inputManager.jumpDuration;

      if (
        duration > MIN_JUMP_KEY_PRESS_DURATION &&
        duration < MAX_JUMP_KEY_PRESS_DURATION
      ) {
        const durationPercent = duration * 0.01;
        const increase = Phaser.Math.FromPercent(
          1 - durationPercent,
          MIN_SPEED_INCREASE,
          MAX_SPEED_INCREASE
        );

        const velocityY = this.body.velocity.y - increase;

        if (velocityY > MAX_JUMP_VELOCITY) {
          this.body.velocity.y = velocityY;
        }
      }
    }

    if (this.body.deltaAbsY() > 0) {
      this.anims.stop();
      this.setTexture('dino');
    } else {
      const animation =
        this.body.height <= DINO_DOWN_HEIGHT
          ? PlayerAnimations.Down
          : PlayerAnimations.Run;
      this.play(animation, true);
    }
  }

  get isOnFloor() {
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      return this.body.onFloor();
    }

    return false;
  }

  get isRunning() {
    return this.playerState === 'running';
  }

  #initEventListeners() {
    this.scene.events.on(GameEvent.Collide, this.#onCollide, this);
    this.scene.events.on(GameEvent.Starting, this.#onStarting, this);
    this.scene.events.on(GameEvent.Started, this.#onStarted, this);
    this.scene.game.events.on(GameEvent.Restart, this.#onRestart, this);
  }

  #initPhysics(physics: Phaser.Physics.Arcade.ArcadePhysics) {
    physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setGravityY(5000);
    this.setBodySize(DINO_BODY_WIDTH, DINO_HEIGHT);
  }

  #initAnimations(animationsManager: Phaser.Animations.AnimationManager) {
    animationsManager.create({
      key: PlayerAnimations.Run,
      frames: animationsManager.generateFrameNames('dino', {
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    animationsManager.create({
      key: PlayerAnimations.Down,
      frames: animationsManager.generateFrameNames('dino-down', {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  #onCollide() {
    this.playerState = 'hurt';
    this.setTexture(PlayerAnimations.Hurt);

    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
    });
  }

  #onStarting() {
    this.setVelocityX(80);
    this.play(PlayerAnimations.Run, true);
  }

  #onStarted() {
    this.setVelocityX(0);
    this.playerState = 'running';
  }

  #onRestart() {
    this.setVelocityY(0);
    this.setBodySize(DINO_BODY_WIDTH, DINO_HEIGHT);
    this.setOffset(this.body.offset.x, 0);
    this.playerState = 'running';
  }
}
