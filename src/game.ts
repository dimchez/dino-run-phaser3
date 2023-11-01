import * as Phaser from 'phaser';

import { DinoRunScene, GameOverScene, PreloadScene } from './scenes';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#FFFFFF',
  autoCenter: Phaser.Scale.CENTER_BOTH,
  width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [PreloadScene, DinoRunScene, GameOverScene],
};

const game = new Phaser.Game(config);
