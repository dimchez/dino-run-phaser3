import { Player } from './Player';

export class PlayerInputManager {
  private player: Player;

  private keys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(player: Player) {
    this.player = player;

    this.keys = player.scene.input.keyboard.createCursorKeys();

    this.keys.space.on('down', this.#jump, this);
    this.keys.up.on('down', this.#jump, this);

    this.keys.down.on('down', this.#duck, this);
    this.keys.down.on('up', this.#riseUp, this);
  }

  get jumpDuration() {
    if (this.keys.space.isDown) {
      return this.keys.space.getDuration();
    } else if (this.keys.up.isDown) {
      return this.keys.up.getDuration();
    }
  }

  #duck() {
    this.player.duck();
  }

  #jump() {
    this.player.jump();
  }

  #riseUp() {
    this.player.riseUp();
  }
}
