export enum GameScene {
  DinoRun = 'dinoRunScene',
  GameOver = 'gameOverScene',
  Preload = 'PreloadScene',
}

export enum GameEvent {
  Achievement = 'achievement',
  Collide = 'collide',
  PlayerAction = 'player-action',
  Starting = 'starting',
  Started = 'started',
  Restart = 'restart',
  UpdateScore = 'update-score',
}

export enum PlayerAnimations {
  Down = 'dino-down',
  Hurt = 'dino-hurt',
  Idle = 'dino-idle',
  Run = 'dino-run',
}

export type PlayerState = 'idle' | 'running' | 'hurt';

export type UpdateScoreEvent = {
  score: number;
  highScore: number;
};
