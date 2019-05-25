import "phaser";
import { rocketSize, TruePosAlpha } from "../config";
import DrawableObject from "./DrawableObject";

export default class Rocket extends DrawableObject {
  draw = () => {
    this.g.fillStyle(this.color, this.trueObject ? TruePosAlpha : undefined);
    this.g.lineStyle(2, 0x000000, this.trueObject ? TruePosAlpha : undefined);
    this.g.fillCircle(this.x, this.y, rocketSize);
    this.g.strokeCircle(this.x, this.y, rocketSize);
  };
}
