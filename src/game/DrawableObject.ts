import "phaser";

export default class DrawableObject {
  x: number;
  y: number;
  id: number;
  g: Phaser.GameObjects.Graphics;
  color: number;
  trueObject?: boolean;

  constructor(
    id: number,
    x: number,
    y: number,
    graphics: Phaser.GameObjects.Graphics,
    color: number,
    trueObject?: boolean,
  ) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.g = graphics;
    this.color = color;
    this.trueObject = trueObject;
  }

  draw = () => {
    console.log("draw called on an object without draw implementation!");
  };
}
