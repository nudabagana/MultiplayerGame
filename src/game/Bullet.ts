import "phaser";
import { bulletSize } from "../config";
import DrawableObject from "./DrawableObject";


export default class Bullet extends DrawableObject {
  draw = () => {
    this.g.fillStyle(this.color);
    this.g.lineStyle(2, 0x000000);
    this.g.fillCircle(this.x, this.y, bulletSize);
    this.g.strokeCircle(this.x, this.y, bulletSize);
  };
}