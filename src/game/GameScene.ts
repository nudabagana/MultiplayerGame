import "phaser";
import { longClickDurationMs, SceneTypes, ServerPort } from "../config";
import NetworkManager from "../network/NetworkManager";
import { CLIENTS, GameObjectTypes, ACTIONS } from "../network/NetworkTypes";
import DrawableObject from "./DrawableObject";
import InputPlayer from "../testing/InputPlayer";
import StateRecorder from "../testing/StateRecorder";

export default class GameScene extends Phaser.Scene {
  gameObjects: DrawableObject[];
  gameObjectsTrue: DrawableObject[];
  graphics?: Phaser.GameObjects.Graphics;
  prevMouseButton: number;
  leftButtonDownTime: number;
  networkManager?: NetworkManager;
  clientType?: CLIENTS;
  stateRecorder?: StateRecorder;
  tick: number;
  tickTrue: number;
  inputPlayer?: InputPlayer;

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
    return this.gameObjects.filter(obj => obj.type === GameObjectTypes.PLAYER);
  };
  //===================End of Game Objects==================

  setTick = (tick: number) => {
    this.tick = tick;
  };

  setTickTrue = (tick: number) => {
    this.tickTrue = tick;
  };

  moveClick = (x: number, y: number) => {
    this.stateRecorder!.addAction(this.tick, this.tickTrue, x, y, ACTIONS.MOVE);
    this.networkManager!.moveTo(x, y);
  };

  rocketClick = (x: number, y: number) => {
    this.stateRecorder!.addAction(
      this.tick,
      this.tickTrue,
      x,
      y,
      ACTIONS.ROCKET
    );
    this.networkManager!.rocketTo(x, y);
  };

  bulletClick = (x: number, y: number) => {
    this.stateRecorder!.addAction(
      this.tick,
      this.tickTrue,
      x,
      y,
      ACTIONS.BULLET
    );
    this.networkManager!.bulletTo(x, y);
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
