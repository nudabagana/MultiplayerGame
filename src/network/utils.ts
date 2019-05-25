import "phaser";
import { player1Color, player2Color } from "../config";
import Bullet from "../game/Bullet";
import Player from "../game/Player";
import Rocket from "../game/Rocket";
import {
  IBullet,
  IPlayer,
  IRocket,
  IGameObject,
  GameObjectTypes,
} from "./networkTypes";

export const playerFromIPlayer = (
  player: IPlayer,
  graphics: Phaser.GameObjects.Graphics,
  trueObject?: boolean
) => {
  return new Player(
    player.id,
    player.x,
    player.y,
    graphics,
    player.id === 1 ? player1Color : player2Color,
    player.health,
    trueObject
  );
};

export const rocketFromIRocket = (
  rocket: IRocket,
  graphics: Phaser.GameObjects.Graphics,
  trueObject?: boolean
) => {
  return new Rocket(
    rocket.id,
    rocket.x,
    rocket.y,
    graphics,
    rocket.playerId === 1 ? player1Color : player2Color,
    trueObject
  );
};

export const bulletFromIBullet = (
  rocket: IBullet,
  graphics: Phaser.GameObjects.Graphics,
  trueObject?: boolean
) => {
  return new Bullet(
    rocket.id,
    rocket.x,
    rocket.y,
    graphics,
    rocket.playerId === 1 ? player1Color : player2Color,
    trueObject
  );
};

export const gameObjectfromIGameObject = (
  obj: IGameObject,
  graphics: Phaser.GameObjects.Graphics,
  trueObject?: boolean
) => {
  if (obj.type === GameObjectTypes.PLAYER) {
    return playerFromIPlayer(obj as IPlayer, graphics, trueObject);
  } else if (obj.type === GameObjectTypes.ROCKET) {
    return rocketFromIRocket(obj as IRocket, graphics, trueObject);
  } else {
    return bulletFromIBullet(obj as IBullet, graphics, trueObject);
  }
};
