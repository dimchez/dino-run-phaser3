import * as Phaser from 'phaser';
import { Player } from './player/Player';
import { GameEvent } from '../types';
import { OBSTICLE_MAX_RESPAWN_TIME } from '../config';

const ENEMY_BIRD_OBSTICLE_INDEX = 7;

const ENEMY_BIRD_HEIGHT = [22, 50];

export class Obsticles {
  private scene: Phaser.Scene;

  private obsticles: Phaser.Physics.Arcade.Group;

  private respawnTime: number;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.respawnTime = 0;

    this.obsticles = scene.physics.add.group();

    scene.game.events.on(GameEvent.Restart, this.#onRestartGame, this);

    scene.physics.add.collider(
      player,
      this.obsticles,
      this.#onCollide,
      null,
      this
    );
  }

  update(gameSpeed: number, delta: number) {
    Phaser.Actions.IncX(this.obsticles.getChildren(), -gameSpeed);

    this.respawnTime += delta * gameSpeed * 0.08;

    if (this.respawnTime >= OBSTICLE_MAX_RESPAWN_TIME) {
      this.#placeObsticle();
      this.respawnTime = 0;
    }

    this.#removeOutOfBoundsObsticles();
  }

  #removeOutOfBoundsObsticles() {
    this.obsticles
      .getChildren()
      .forEach(
        (obsticle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
          if (obsticle.getBounds().right < 0) {
            obsticle.destroy();
          }
        }
      );
  }

  #onCollide() {
    this.respawnTime = 0;
    this.scene.events.emit(GameEvent.Collide);
  }

  #onRestartGame() {
    this.obsticles.clear(true, true);
  }

  #placeObsticle() {
    const { height, width } = this.scene.game.config;

    const canvasHeight = Number(height);
    const canvasWidth = Number(width);

    const obsticleNumber = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(300, 600);

    const obsticle =
      obsticleNumber < ENEMY_BIRD_OBSTICLE_INDEX
        ? this.#createCactusObsticle(
            canvasHeight,
            canvasWidth,
            distance,
            obsticleNumber
          )
        : this.#createBirdObsticle(canvasHeight, canvasWidth, distance);

    obsticle.setOrigin(0, 1).setImmovable();
  }

  #createBirdObsticle(height: number, width: number, distance: number) {
    const obsticle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
      this.obsticles.create(
        width + distance,
        height - Phaser.Math.RND.pick(ENEMY_BIRD_HEIGHT),
        'enemy-bird'
      );
    obsticle.play('enemy-bird-fly', true);
    obsticle.body.setSize(undefined, obsticle.body.height / 1.5);

    return obsticle;
  }

  #createCactusObsticle(
    height: number,
    width: number,
    distance: number,
    index: number
  ) {
    const obsticle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
      this.obsticles.create(width + distance, height, `obsticle-${index}`);
    obsticle.body.offset.y += 10;

    return obsticle;
  }
}
