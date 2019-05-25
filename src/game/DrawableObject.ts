import "phaser";
import { GameObjectTypes } from "../network/NetworkTypes";

export default class DrawableObject {
  x: number;
  y: number;
  id: number;
  g: Phaser.GameObjects.Graphics;
  color: number;
  type: GameObjectTypes;
  trueObject?: boolean;

  constructor(
    id: number,
    x: number,
    y: number,
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    type: GameObjectTypes,
    trueObject?: boolean,
  ) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.g = graphics;
    this.color = color;
    this.type = type;
    this.trueObject = trueObject;
  }

  draw = () => {
    console.log("draw called on an object without draw implementation!");
  };
}
