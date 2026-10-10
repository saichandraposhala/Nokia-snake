export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type DifficultyPreset = 'casual' | 'classic' | 'turbo';

export type WallMode = 'solid' | 'wrap';

export type MapType = 'open' | 'pillars' | 'corners' | 'cross' | 'box';

export interface Point {
  x: number;
  y: number;
}

export interface MapDefinition {
  id: MapType;
  name: string;
  label: string;
  description: string;
  barriers: Point[];
}

export interface BonusBug {
  x: number;
  y: number;
  type: 'spider' | 'ladybug';
  points: number;
  timer: number; // ticks remaining
  maxTimer: number;
}

export interface GameTelemetry {
  currentTick: number; // ms
  velocity: number; // tiles per second
  eggsEaten: number;
  snakeLength: number;
  gridCoverage: number; // percentage 0-100
  sessionScore: number;
  highScore: number;
  bonusEaten: number;
  currentMap: MapType;
  causeOfDeath?: 'wall' | 'self' | null;
}

export interface HighScoreRecord {
  id: string;
  initials: string;
  score: number;
  difficulty: DifficultyPreset;
  wallMode: WallMode;
  mapType: MapType;
  date: string;
  snakeLength: number;
}

export interface SoundSettings {
  enabled: boolean;
  masterVolume: number; // 0 to 1
  moveSoundEnabled: boolean;
  moveSoundVolume: number; // 0 to 1
}

export interface UserStats {
  totalGames: number;
  totalEggs: number;
  highestScore: number;
  longestSnake: number;
  totalPlayTimeSeconds: number;
}
