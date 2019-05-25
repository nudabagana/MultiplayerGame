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
  gameObjects: IGameObject[];
}

export enum CLIENTS {
  PLAYER = "0",
  SPECTATOR = "1",
}

export interface IGameObject {
  type: GameObjectTypes;
  id: number;
  x: number;
  y: number;
}

export interface IPlayer extends IGameObject {
  health: number;
}

export interface IRocket extends IGameObject {
  playerId: number;
}

export interface IBullet extends IGameObject {
  playerId: number;
}

export enum GameObjectTypes {
  PLAYER = 0,
  ROCKET = 1,
  BULLET = 2,
}
