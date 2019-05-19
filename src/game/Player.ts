import "phaser";
import { GREEN, healthBarSize, maxHealh, playerSize, RED } from "../config";
import DrawableObject from "./DrawableObject";

export default class Player extends DrawableObject {
  health: number;

  constructor(
    id: number,
    x: number,
    y: number,
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    health: number
  ) {
    super(id, x, y, graphics, color);
    this.health = health;
  }

  draw = () => {
    this.g.fillStyle(this.color);
    this.g.lineStyle(2, 0x000000);
    this.g.fillCircle(this.x, this.y, playerSize);
    this.g.strokeCircle(this.x, this.y, playerSize);

    this.g.fillStyle(RED);
    this.g.fillRoundedRect(
      this.x - playerSize,
      this.y - playerSize - 15,
      healthBarSize,
      10,
      5
    );
    this.g.fillStyle(GREEN);
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
