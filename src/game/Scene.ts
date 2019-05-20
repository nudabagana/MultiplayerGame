import "phaser";
import { longClickDurationMs, ServerPort, SceneTypes } from "../config";
import NetworkManager from "../network/network";
import Bullet from "./Bullet";
import Player from "./Player";
import Rocket from "./Rocket";
import { CLIENTS } from "../network/networkTypes";

export default class GameScene extends Phaser.Scene {
  players: Player[];
  rockets: Rocket[];
  bullets: Bullet[];
  graphics?: Phaser.GameObjects.Graphics;
  prevMouseButton: number;
  leftButtonDownTime: number;
  networkManager?: NetworkManager;
  clientType?: CLIENTS;

  constructor() {
    super({
      key: "GameScene",
    });
    this.players = [];
    this.rockets = [];
    this.bullets = [];
    this.graphics = undefined;
    this.prevMouseButton = 0;
    this.leftButtonDownTime = 0;
  }

  init = (data : {client : CLIENTS}) => {
    this.clientType = data.client;
  }

  addPlayer = (
    id: number,
    x: number,
    y: number,
    color: number,
    health: number
  ) => {
    if (!this.players.find(player => player.id === id)) {
      this.players.push(new Player(id, x, y, this.graphics!, color, health));
    }
  };

  clearPlayers = () => {
    this.players = [];
  };

  removePlayer = (id: number) => {
    this.players = this.players.filter(player => player.id !== id);
  };

  updatePlayer = (id: number, x: number, y: number) => {
    const player = this.players.find(player => player.id === id);
    if (player) {
      player.x = x;
      player.y = y;
    }
  };

  addRocket = (id: number, color: number, x: number, y: number) => {
    if (!this.rockets.find(rocket => rocket.id === id)) {
      this.rockets.push(new Rocket(id, x, y, this.graphics!, color));
    }
  };

  clearRockets = () => {
    this.rockets = [];
  };

  removeRocket = (id: number) => {
    this.rockets = this.rockets.filter(rocket => rocket.id !== id);
  };

  updateRocket = (id: number, x: number, y: number) => {
    const rocket = this.rockets.find(rocket => rocket.id === id);
    if (rocket) {
      rocket.x = x;
      rocket.y = y;
    }
  };

  addBullet = (id: number, color: number, x: number, y: number) => {
    if (!this.bullets.find(bullet => bullet.id === id)) {
      this.bullets.push(new Bullet(id, x, y, this.graphics!, color));
    }
  };

  clearBullets = () => {
    this.bullets = [];
  };

  removeBullet = (id: number) => {
    this.bullets = this.bullets.filter(bullet => bullet.id !== id);
  };

  updateBullet = (id: number, x: number, y: number) => {
    const bullet = this.bullets.find(bullet => bullet.id === id);
    if (bullet) {
      bullet.x = x;
      bullet.y = y;
    }
  };

  create(): void {
    this.input.mouse.disableContextMenu();
    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => {
        if (this.prevMouseButton + 1 === pointer.buttons) {
          this.leftButtonDownTime = new Date().getTime();
        } else if (this.prevMouseButton + 2 === pointer.buttons) {
          this.moveClick(pointer.x, pointer.y);
        }
        this.prevMouseButton = pointer.buttons;
      },
      this
    );
    this.input.on(
      "pointerup",
      (pointer: Phaser.Input.Pointer) => {
        if (this.prevMouseButton - 1 === pointer.buttons) {
          const pressTime = new Date().getTime() - this.leftButtonDownTime;
          if (pressTime > longClickDurationMs) {
            this.rocketClick(pointer.x, pointer.y);
          } else {
            this.bulletClick(pointer.x, pointer.y);
          }
        }
        this.prevMouseButton = pointer.buttons;
      },
      this
    );
    this.graphics = this.add.graphics();
      
    this.networkManager = new NetworkManager(location.hostname, ServerPort, this, this.clientType === CLIENTS.SPECTATOR);

    this.input.keyboard.on('keydown-ESC', () => {
      if (this.networkManager) {
        this.networkManager.close();
      }
      this.scene.start(SceneTypes.MENU);
    });
  }

  moveClick = (x: number, y: number) => {
    this.networkManager!.moveTo(x, y);
  };

  rocketClick = (x: number, y: number) => {
    this.networkManager!.rocketTo(x, y);
  };

  bulletClick = (x: number, y: number) => {
    this.networkManager!.bulletTo(x, y);
  };

  update(time: number, delta: number): void {
    this.graphics!.clear();
    this.players.forEach(player => player.draw());
    this.rockets.forEach(rocket => rocket.draw());
    this.bullets.forEach(bullet => bullet.draw());
  }
}
