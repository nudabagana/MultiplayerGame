import "phaser";
import { GREEN, healthBarSize, maxHealh, playerSize, RED, TruePosAlpha } from "../config";
import DrawableObject from "./DrawableObject";
import { GameObjectTypes } from "../network/NetworkTypes";

export default class Player extends DrawableObject {
  health: number;

  constructor(
    id: number,
    x: number,
    y: number,
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    health: number,
    type: GameObjectTypes,
    trueObject?: boolean,
  ) {
    super(id, x, y, graphics, color, type,trueObject);
    this.health = health;
  }

  draw = () => {
    this.g.fillStyle(this.color, this.trueObject ? TruePosAlpha : undefined);
    this.g.lineStyle(2, 0x000000, this.trueObject ? TruePosAlpha : undefined);
    this.g.fillCircle(this.x, this.y, playerSize);
    this.g.strokeCircle(this.x, this.y, playerSize);

    this.g.fillStyle(RED, this.trueObject ? TruePosAlpha : undefined);
    this.g.fillRoundedRect(
      this.x - playerSize,
      this.y - playerSize - 15,
      healthBarSize,
      10,
      5
    );
    this.g.fillStyle(GREEN, this.trueObject ? TruePosAlpha : undefined);
    this.g.fillRoundedRect(
      this.x - playerSize,
      this.y - playerSize - 15,
      healthBarSize * Math.max(this.health / maxHealh, 0),
      10,
      5
    );

    this.g.strokeRoundedRect(
      this.x - playerSize,
      this.y - playerSize - 15,
      healthBarSize,
      10,
      5
    );
  };
}
