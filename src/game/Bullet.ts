import "phaser";
import { bulletSize, TruePosAlpha } from "../config";
import DrawableObject from "./DrawableObject";


export default class Bullet extends DrawableObject {
  draw = () => {
    this.g.fillStyle(this.color, this.trueObject ? TruePosAlpha : undefined);
    this.g.lineStyle(2, 0x000000, this.trueObject ? TruePosAlpha : undefined);
    this.g.fillCircle(this.x, this.y, bulletSize);
    this.g.strokeCircle(this.x, this.y, bulletSize);
  };
}
