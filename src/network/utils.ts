import "phaser";
import { player1Color, player2Color } from "../config";
import Bullet from "../game/Bullet";
import Player from "../game/Player";
import Rocket from "../game/Rocket";
import { IBullet, IPlayer, IRocket } from "./networkTypes";

export const playerFromIPlayer = (
  player: IPlayer,
  graphics: Phaser.GameObjects.Graphics,
  trueObject?: boolean,
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
  trueObject?: boolean,
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
  trueObject?: boolean,
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
