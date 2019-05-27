export enum ACTIONS {
  MOVE = 0,
  BULLET = 1,
  ROCKET = 2,
  SET_PING = 3,
}

export enum NetworkMsgTypes {
  STATE = 0,
  ACTION = 1,
  CREATE = 2,
  DELETE = 3,
  SET_TICK = 4,
}

export interface INetworkMsg {
  data: IData;
  trueState: boolean;
}

export interface IData {
  tick: number;
  type: NetworkMsgTypes;
  gameObjects?: IGameObject[];
  action?: IGameAction;
  gameObject?: IPlayer | IRocket | IBullet;
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
  destinationX: number;
  destinationY: number;
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

export interface IGameAction {
  id?: number;
  playerId: number;
  action: ACTIONS;
  x: number;
  y: number;
}

export interface IMessageStorage {
  [t: number]: IMessage[];
}

export interface IServerStateStorage {
  [t: number]: IGameObject[];
}

export interface IMessage {
  action?: IGameAction;
  objToCreate?: IPlayer | IRocket | IBullet;
  objToDelete?: IPlayer | IRocket | IBullet;
}
