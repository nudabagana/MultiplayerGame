export enum ACTIONS {
  MOVE = 0,
  BULLET = 1,
  ROCKET = 2,
  SET_PING = 3,
}

export interface NetworkMsg {
  players: Player[];
  rockets: Rocket[];
  bullets: Bullet[];
}

export enum CLIENTS {
  PLAYER = "0",
  SPECTATOR = "1",
}

interface ServerGameObject {
  id: number;
  x: number;
  y: number;
}

interface Player extends ServerGameObject {
  health: number;
}

interface Rocket extends ServerGameObject {
  playerId: number;
}

interface Bullet extends ServerGameObject {
  playerId: number;
}
