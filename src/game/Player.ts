import "phaser";
import { GREEN, healthBarSize, maxHealh, playerSize, RED, TruePosAlpha, playerSeed, rocketDamage, bulletDamage, playerAllowedOffset } from "../config";
import GameObject from "./GameObject";
import { GameObjectTypes, IGameObject } from "../network/NetworkTypes";
import Rocket from "./Rocket";

export default class Player extends GameObject {
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
    super(id, x, y, playerSeed, playerSize, graphics, color, type,trueObject);
    this.health = health;
  }

  moveTo = (x: number, y: number) => {
    this.calculateMovement(x,y);
  };

  onCollision = (other: GameObject) => {
    if (other.type === GameObjectTypes.ROCKET && (other as Rocket).playerId !== this.id){
      this.takeDamage(rocketDamage);
      other.destroy();
    }else if (other.type === GameObjectTypes.BULLET){
      this.takeDamage(bulletDamage);
      // other.destroy();
    }
  }

  takeDamage = (damage: number ) => {
    this.health -= damage;
    if (this.health <= 0){
      this.die();
    }
  }

  die = () => {
    this.destroy();
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

  fixState = (obj: IGameObject) => {
    let xOffset = obj.x - this.x;
    
    if ( Math.abs(xOffset) > playerAllowedOffset ){
       if ( xOffset > 0) {
         xOffset -= playerAllowedOffset;
       } else {
        xOffset += playerAllowedOffset;
       }
    } else {
      xOffset = 0;
    }
    let yOffset = obj.y - this.y;

    if ( Math.abs(yOffset) > playerAllowedOffset ){
       if ( yOffset > 0) {
        yOffset -= playerAllowedOffset;
       } else {
        yOffset += playerAllowedOffset;
       }
    } else {
      yOffset = 0;
    }

    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.interpolatedAmount = 0;
  };
}
