import "phaser";
import { longClickDurationMs, SceneTypes, ServerPort } from "../config";
import NetworkManager from "../network/NetworkManager";
import { CLIENTS, GameObjectTypes } from "../network/NetworkTypes";
import DrawableObject from "./DrawableObject";
import InputPlayer from "../testing/InputPlayer"

export default class GameScene extends Phaser.Scene {
  gameObjects: DrawableObject[];
  gameObjectsTrue: DrawableObject[];
  graphics?: Phaser.GameObjects.Graphics;
  prevMouseButton: number;
  leftButtonDownTime: number;
  networkManager?: NetworkManager;
  clientType?: CLIENTS;

  constructor() {
    super({
      key: "GameScene",
    });
    this.gameObjects = [];
    this.gameObjectsTrue = [];
    this.graphics = undefined;
    this.prevMouseButton = 0;
    this.leftButtonDownTime = 0;
  }

  init = (data: { client: CLIENTS }) => {
    this.clientType = data.client;
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

    this.networkManager = new NetworkManager(
      location.hostname,
      ServerPort,
      this,
      this.clientType === CLIENTS.SPECTATOR
    );

    this.input.keyboard.on("keydown-ESC", () => {
      if (this.networkManager) {
        this.networkManager.close();
      }
      this.scene.start(SceneTypes.MENU);
    });
//=============InputPlayer==========================
    const inputPlayer = new InputPlayer(this);
    this.input.keyboard.on("keydown-SPACE", () => {
      inputPlayer.setupPosition();
    });
    this.input.keyboard.on("keydown-ONE", () => {
      inputPlayer.playInput1();
    });
    this.input.keyboard.on("keydown-TWO", () => {
      inputPlayer.playInput2();
    });
    this.input.keyboard.on("keydown-THREE", () => {
      inputPlayer.playInput3();
    });
    this.input.keyboard.on("keydown-FOUR", () => {
      inputPlayer.playInput4();
    });
    this.input.keyboard.on("keydown-FIVE", () => {
      inputPlayer.playInput5();
    });
    this.input.keyboard.on("keydown-SIX", () => {
      inputPlayer.playInput6();
    });
    this.input.keyboard.on("keydown-SEVEN", () => {
      inputPlayer.playInput7();
    });
    this.input.keyboard.on("keydown-EIGHT", () => {
      inputPlayer.playInput8();
    });
    this.input.keyboard.on("keydown-NINE", () => {
      inputPlayer.playInput9();
    });
  }

  update(time: number, delta: number): void {
    this.graphics!.clear();
    this.gameObjects.forEach(obj => obj.draw());
    this.gameObjectsTrue.forEach(obj => obj.draw());
  }
//===================Game Objects==================
  addGameObject = (obj: DrawableObject) => {
    this.gameObjects.push(obj);
  };

  clearGameObjects = () => {
    this.gameObjects = [];
  };

  removeGameObject = (id: number) => {
    this.gameObjects = this.gameObjects.filter(obj => obj.id !== id);
  };

  updateGameObjectPos = (id: number, x: number, y: number) => {
    const obj = this.gameObjects.find(obj => obj.id === id);
    if (obj) {
      obj.x = x;
      obj.y = y;
    }
  };

  addGameObjectTrue = (obj: DrawableObject) => {
    this.gameObjectsTrue.push(obj);
  };

  clearGameObjectsTrue = () => {
    this.gameObjectsTrue = [];
  };

  removeGameObjectTrue = (id: number) => {
    this.gameObjectsTrue = this.gameObjectsTrue.filter(obj => obj.id !== id);
  };

  updateGameObjectPosTrue = (id: number, x: number, y: number) => {
    const obj = this.gameObjectsTrue.find(obj => obj.id === id);
    if (obj) {
      obj.x = x;
      obj.y = y;
    }
  };

  getPlayers = () => {
    return this.gameObjects.filter( obj => obj.type === GameObjectTypes.PLAYER);
  }
//===================End of Game Objects==================
  moveClick = (x: number, y: number) => {
    this.networkManager!.moveTo(x, y);
  };

  rocketClick = (x: number, y: number) => {
    this.networkManager!.rocketTo(x, y);
  };

  bulletClick = (x: number, y: number) => {
    this.networkManager!.bulletTo(x, y);
  };
}
