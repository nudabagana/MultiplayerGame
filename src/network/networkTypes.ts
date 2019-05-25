export enum ACTIONS {
  MOVE = 0,
  BULLET = 1,
  ROCKET = 2,
  SET_PING = 3,
}

export interface INetworkMsg {
  gameState: IGameState;
  trueState: boolean;
}

export interface IGameState {
  tick: number;
  players: IPlayer[];
  rockets: IRocket[];
  bullets: IBullet[];
}

export enum CLIENTS {
  PLAYER = "0",
  SPECTATOR = "1",
}

export interface IServerGameObject {
  id: number;
  x: number;
  y: number;
}

export interface IPlayer extends IServerGameObject {
  health: number;
}

export interface IRocket extends IServerGameObject {
  playerId: number;
}

export interface IBullet extends IServerGameObject {
  playerId: number;
}
