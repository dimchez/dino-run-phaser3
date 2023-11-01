import * as Phaser from 'phaser';
import { GameEvent } from '../../types';
import { Player } from './Player';

const START_TRIGGER_POSITION_Y = 10;

export class StartTrigger extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, player: Player) {
    super(scene, 0, START_TRIGGER_POSITION_Y, 'start-trigger');

    this.setOrigin(0, 1);
    this.setAlpha(0);

    scene.physics.add.existing(this);

    this.setImmovable();

    scene.physics.add.overlap(
      this,
      player,
      this.#onStartTriggerOverlap,
      null,
      this
    );
  }

  #onStartTriggerOverlap() {
    const { height } = this.scene.game.config;

    const canvasHeight = Number(height);

    if (this.y === START_TRIGGER_POSITION_Y) {
      this.body.reset(0, canvasHeight);
      return;
    }

    this.disableBody(true, true);

    this.scene.events.emit(GameEvent.Starting);
  }
}
