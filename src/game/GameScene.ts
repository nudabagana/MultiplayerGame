import "phaser";
import {
  longClickDurationMs,
  SceneTypes,
  ServerPort,
  rocketLifespan,
  player1Color,
  player2Color,
  bulletLifespan,
} from "../config";
import NetworkManager from "../network/NetworkManager";
import {
  CLIENTS,
  GameObjectTypes,
  ACTIONS,
  IMessageStorage,
  IGameAction,
  IMessage,
  IServerStateStorage,
  IPlayer,
  IRocket,
  IBullet,
  IGameObject,
} from "../network/NetworkTypes";
import GameObject from "./GameObject";
import InputPlayer from "../testing/InputPlayer";
import StateRecorder from "../testing/StateRecorder";
import { gameObjectfromIGameObject } from "../network/utils";
import Rocket from "./Rocket";
import Bullet from "./Bullet";
import Player from "./Player";

const TICK_TIME = 1000 / 30;

export default class GameScene extends Phaser.Scene {
  gameObjects: GameObject[];
  gameObjectsTrue: GameObject[];
  graphics?: Phaser.GameObjects.Graphics;
  prevMouseButton: number;
  leftButtonDownTime: number;
  networkManager?: NetworkManager;
  clientType?: CLIENTS;
  stateRecorder?: StateRecorder;
  tick: number;
  tickTrue: number;
  inputPlayer?: InputPlayer;
  unsimulatedTime: number;
  receivedMessages: IMessageStorage;
  serverState: IServerStateStorage;
  localPlayerId: number;
  nextProjectileId: number;

  constructor() {
    super({
      key: "GameScene",
    });
    this.gameObjects = [];
    this.gameObjectsTrue = [];
    this.graphics = undefined;
    this.prevMouseButton = 0;
    this.leftButtonDownTime = 0;
    this.tick = 0;
    this.tickTrue = 0;
    this.unsimulatedTime = 0;
    this.receivedMessages = {};
    this.serverState = {};
    this.localPlayerId = 0;
    this.nextProjectileId = 0;
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
    this.inputPlayer = inputPlayer;
    this.stateRecorder = new StateRecorder();
    this.input.keyboard.on("keydown-D", () => {
      this.stateRecorder!.save();
    });
    this.input.keyboard.on("keydown-R", () => {
      this.stateRecorder!.startRecording();
    });
    this.input.keyboard.on("keydown-C", () => {
      this.stateRecorder!.clear();
    });
    this.input.keyboard.on("keydown-S", () => {
      this.stateRecorder!.stopRecording();
    });
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
    this.input.keyboard.on("keydown-A", () => {
      this.recordAllInputs(true);
    });
    this.input.keyboard.on("keydown-Q", () => {
      this.recordAllInputs(false);
    });
  }

  update(time: number, delta: number): void {
    this.unsimulatedTime += delta;

    while (this.unsimulatedTime > TICK_TIME) {
      this.simulateStep(TICK_TIME);
      this.unsimulatedTime -= TICK_TIME;
      this.tick++;
    }

    this.graphics!.clear();
    this.gameObjects.forEach(obj => obj.draw());
    this.gameObjectsTrue.forEach(obj => obj.draw());
    this.stateRecorder!.addState(
      this.tick,
      this.tickTrue,
      this.gameObjects,
      this.gameObjectsTrue
    );
  }

  simulateStep = (delta: number) => {
    this.applyServerState();
    this.move(delta);
    this.checkCollisions();
    this.destroy();
  };

  move = (delta: number) => {
    this.gameObjects.forEach(obj => obj.move(delta));
  };

  checkCollisions = () => {
    this.gameObjects.forEach(object => {
      if (object.type !== GameObjectTypes.BULLET) {
        this.gameObjects.forEach(other => {
          if (
            other.type !== GameObjectTypes.BULLET &&
            this.checkCollision(object, other)
          ) {
            object.onCollision(other);
          }
        });
      }
    });
  };

  checkCollision = (object: GameObject, other: GameObject) => {
    if (object.type !== other.type || object.id !== other.id) {
      let distancePOW =
        Math.pow(object.x - other.x, 2) + Math.pow(object.y - other.y, 2);
      let bothradiusPOW = Math.pow(object.size + other.size, 2);
      if (distancePOW < bothradiusPOW) {
        return true;
      }
    }
    return false;
  };

  checkCollisionBullet = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    circleX: number,
    circleY: number,
    radius: number
  ) => {
    const slope = (y2 - y1) / (x2 - x1);
    const B = 1;
    const A = -1 * slope;
    const C = slope * x1 - y1;
    const distance =
      Math.abs(A * circleX + B * circleY + C) / Math.sqrt(A * A + B * B);
    if (radius >= distance) {
      return true;
    }
    return false;
  };

  destroy = () => {
    this.gameObjects.forEach(obj => {
      if (obj.shouldBeDestroyed) {
        this.removeGameObject(obj.id, obj.type);
      }
    });
  };

  //===================Game Objects==================
  addRocket = (
    id: number,
    playerId: number,
    x: number,
    y: number,
    destX: number,
    destY: number
  ) => {
    const rocket = new Rocket(
      id,
      playerId,
      x,
      y,
      destX,
      destY,
      this.graphics!,
      playerId === 1 ? player1Color : player2Color,
      GameObjectTypes.ROCKET
    );
    this.gameObjects.push(rocket);
    setTimeout(
      () => this.removeGameObject(rocket.id, rocket.type),
      rocketLifespan
    );
  };

  addBullet = (
    id: number,
    playerId: number,
    x: number,
    y: number,
    destX: number,
    destY: number
  ) => {
    const bullet = new Bullet(
      id,
      playerId,
      x,
      y,
      destX,
      destY,
      this.graphics!,
      playerId === 1 ? player1Color : player2Color,
      GameObjectTypes.BULLET
    );
    this.gameObjects.forEach(obj => {
      if (obj.type === GameObjectTypes.PLAYER && obj.id !== playerId) {
        if (
          this.checkCollisionBullet(x, y, destX, destY, obj.x, obj.y, obj.size)
        ) {
          obj.onCollision(bullet);
        }
      }
    });
    this.gameObjects.push(bullet);

    setTimeout(
      () => this.removeGameObject(bullet.id, bullet.type),
      bulletLifespan
    );
  };

  addGameObject = (obj: GameObject) => {
    this.gameObjects.push(obj);
  };

  clearGameObjects = () => {
    this.gameObjects = [];
  };

  removeGameObject = (id: number, type: GameObjectTypes) => {
    this.gameObjects = this.gameObjects.filter(
      o => o.id !== id || o.type !== type
    );
  };

  updateGameObjectPos = (id: number, x: number, y: number) => {
    const obj = this.gameObjects.find(obj => obj.id === id);
    if (obj) {
      obj.x = x;
      obj.y = y;
    }
  };

  addGameObjectTrue = (obj: GameObject) => {
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
    return this.gameObjects.filter(obj => obj.type === GameObjectTypes.PLAYER);
  };

  getPlayer = (id: number) => {
    return this.gameObjects.find(
      obj => obj.type === GameObjectTypes.PLAYER && obj.id === id
    );
  };

  setLocalPlayerId = (id : number) => {
    this.localPlayerId = id;
  }
  //===================End of Game Objects==================
  //===================Input Buffer==================
  addMessage = (tick: number, message: IMessage) => {
    if (!this.receivedMessages[tick]) {
      this.receivedMessages[tick] = [];
    }
    this.receivedMessages[tick].push(message);
  };

  applyMessages = () => {
    if (this.receivedMessages[this.tick]) {
      this.receivedMessages[this.tick].forEach(msg => {
        this.applyMessage(msg);
      });
      delete this.receivedMessages[this.tick];
    }
  };

  applyMessage = (msg: IMessage) => {
    if (msg.action) {
      const player = this.getPlayer(msg.action.playerId);
      if (msg.action.action === ACTIONS.MOVE) {
        if (player) {
          player.calculateMovement(msg.action.x, msg.action.y);
        }
      } else if (msg.action.action === ACTIONS.ROCKET) {
        if (player) {
          this.addRocket(
            msg.action.id!,
            msg.action.playerId,
            player.x,
            player.y,
            msg.action.x,
            msg.action.y
          );
        }
      } else if (msg.action.action === ACTIONS.BULLET) {
        if (player) {
          this.addBullet(
            msg.action.id!,
            msg.action.playerId,
            player.x,
            player.y,
            msg.action.x,
            msg.action.y
          );
        }
      }
    }
    if (msg.objToCreate) {
      this.addGameObject(
        gameObjectfromIGameObject(msg.objToCreate, this.graphics!)
      );
    }
    if (msg.objToDelete) {
      this.removeGameObject(msg.objToDelete.id, msg.objToDelete.type);
    }
  };
  //===================End of Input Buffer==================
  //===================State Buffer==================
  addServerState = (tick: number, state: IGameObject[]) => {
    this.serverState[tick] = state;
  };

  applyServerState = () => {
    if (this.serverState[this.tick]) {
      this.serverState[this.tick].forEach(obj => {
        this.fixGameObjectState(obj);
      });
      delete this.serverState[this.tick];
    }
  };

  fixGameObjectState = (obj: IGameObject) => {
    const objToFix = this.gameObjects.find(o => o.id === obj.id && o.type === obj.type);
    if (objToFix){
      objToFix.fixState(obj);

      if (objToFix.type === GameObjectTypes.PLAYER){
        (objToFix as Player).health = (obj as IPlayer).health;
      }
    }
  };
  //===================End of State Buffer==================

  checkTick = (tick: number) => {
    if (this.tick >= tick) {
      console.log("Client running to fast! Ticks rollbacked");
      this.tick = tick - 1;
    }
    if (this.tick + 2 < tick) {
      console.log("Client running to slow! Ticks updated");
      this.tick = tick - 1;
    }
  };

  setTick = (tick: number) => {
    this.tick = tick;
  };

  setTickTrue = (tick: number) => {
    this.tickTrue = tick;
  };

  getNextProjectileId = () => {
    const id = this.localPlayerId * 100000 + this.nextProjectileId;
    this.nextProjectileId++;
    return id;
  }

  moveClick = (x: number, y: number) => {
    this.applyMessage({action: {action: ACTIONS.MOVE, x, y, playerId: this.localPlayerId}});
    this.stateRecorder!.addAction(this.tick, this.tickTrue, x, y, ACTIONS.MOVE);
    this.networkManager!.moveTo(x, y);
  };

  rocketClick = (x: number, y: number) => {
    const id = this.getNextProjectileId();

    this.applyMessage({action: {action: ACTIONS.ROCKET, x, y, playerId: this.localPlayerId, id}});

    this.stateRecorder!.addAction(
      this.tick,
      this.tickTrue,
      x,
      y,
      ACTIONS.ROCKET
    );
    this.networkManager!.rocketTo(id, x, y);
  };

  bulletClick = (x: number, y: number) => {
    const id = this.getNextProjectileId();

    this.applyMessage({action: {action: ACTIONS.BULLET, x, y, playerId: this.localPlayerId, id}});

    this.stateRecorder!.addAction(
      this.tick,
      this.tickTrue,
      x,
      y,
      ACTIONS.BULLET
    );
    this.networkManager!.bulletTo(id,x, y, this.tick);
  };

  recordAllInputs = (doInputs: boolean) => {
    const inputPlayer = this.inputPlayer!;
    const recorder = this.stateRecorder!;
    if (doInputs) {
      inputPlayer.setupPosition();
    }
    // Input 1
    setTimeout(() => {
      recorder.clear();
      recorder.startRecording();
      if (doInputs) {
        inputPlayer.playInput1();
      }
      setTimeout(() => {
        recorder.stopRecording();
        recorder.setFileNote("Input 1");
        recorder.save();
        // Input 2
        recorder.clear();
        recorder.startRecording();
        if (doInputs) {
          inputPlayer.playInput2();
        }
        setTimeout(() => {
          recorder.stopRecording();
          recorder.setFileNote("Input 2");
          recorder.save();
          // Input 3
          recorder.clear();
          recorder.startRecording();
          if (doInputs) {
            inputPlayer.playInput3();
          }
          setTimeout(() => {
            recorder.stopRecording();
            recorder.setFileNote("Input 3");
            recorder.save();
            // Input 4
            inputPlayer.setupPosition();
            setTimeout(() => {
              recorder.clear();
              recorder.startRecording();
              if (doInputs) {
                inputPlayer.playInput4();
              }
              setTimeout(() => {
                recorder.stopRecording();
                recorder.setFileNote("Input 4");
                recorder.save();
                // Input 5
                inputPlayer.setupPosition();
                setTimeout(() => {
                  recorder.clear();
                  recorder.startRecording();
                  if (doInputs) {
                    inputPlayer.playInput5();
                  }
                  setTimeout(() => {
                    recorder.stopRecording();
                    recorder.setFileNote("Input 5");
                    recorder.save();
                    // Input 6
                    inputPlayer.setupPosition();
                    setTimeout(() => {
                      recorder.clear();
                      recorder.startRecording();
                      if (doInputs) {
                        inputPlayer.playInput6();
                      }
                      setTimeout(() => {
                        recorder.stopRecording();
                        recorder.setFileNote("Input 6");
                        recorder.save();
                        // Input 7
                        inputPlayer.setupPosition();
                        setTimeout(() => {
                          recorder.clear();
                          recorder.startRecording();
                          if (doInputs) {
                            inputPlayer.playInput7();
                          }
                          setTimeout(() => {
                            recorder.stopRecording();
                            recorder.setFileNote("Input 7");
                            recorder.save();
                            // Input 8
                            inputPlayer.setupPosition();
                            setTimeout(() => {
                              recorder.clear();
                              recorder.startRecording();
                              if (doInputs) {
                                inputPlayer.playInput8();
                              }
                              setTimeout(() => {
                                recorder.stopRecording();
                                recorder.setFileNote("Input 8");
                                recorder.save();
                                // Input 9
                                inputPlayer.setupPosition();
                                setTimeout(() => {
                                  recorder.clear();
                                  recorder.startRecording();
                                  if (doInputs) {
                                    inputPlayer.playInput9();
                                  }
                                  setTimeout(() => {
                                    recorder.stopRecording();
                                    recorder.setFileNote("Input 9");
                                    recorder.save();
                                    // Next Inputs
                                  }, 15000);
                                }, 7000);
                              }, 15000);
                            }, 7000);
                          }, 15000);
                        }, 7000);
                      }, 15000);
                    }, 7000);
                  }, 7000);
                }, 7000);
              }, 7000);
            }, 7000);
          }, 7000);
        }, 5000);
      }, 5000);
    }, 9000);
  };
}
