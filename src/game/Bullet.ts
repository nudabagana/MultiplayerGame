import "phaser";
import { bulletSize, TruePosAlpha, bulletSpeed } from "../config";
import GameObject from "./GameObject";
import { GameObjectTypes } from "../network/NetworkTypes";


export default class Bullet extends GameObject {
  playerId: number;

  constructor(
    id: number,
    playerId: number,
    x: number,
    y: number,
    destX: number,
    destY: number,
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    type: GameObjectTypes,
    trueObject?: boolean,
  ) {
    super(id, x, y, bulletSpeed, bulletSize, graphics, color, type,trueObject);
    this.destinationX = destX;
    this.destinationY = destY;
    this.RecalculateXYPercentages();
    this.playerId = playerId;
  }

  move = (delta: number) => {
    this.x += delta * this.xPerT;
    this.y += delta * this.yPerT;
  };

  draw = () => {
    this.g.fillStyle(this.color, this.trueObject ? TruePosAlpha : undefined);
    this.g.lineStyle(2, 0x000000, this.trueObject ? TruePosAlpha : undefined);
    this.g.fillCircle(this.x, this.y, bulletSize);
    this.g.strokeCircle(this.x, this.y, bulletSize);
  };
}
