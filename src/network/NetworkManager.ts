import { SceneTypes } from "../config";
import GameScene from "../game/GameScene";
import {
  ACTIONS,
  CLIENTS,
  IData,
  INetworkMsg,
  IGameObject,
  NetworkMsgTypes,
} from "./NetworkTypes";
import { gameObjectfromIGameObject } from "./utils";

export default class NetworkManager {
  socket: WebSocket;
  scene: GameScene;

  constructor(
    addr: string,
    port: string,
    scene: GameScene,
    spectator?: boolean
  ) {
    this.scene = scene;
    this.socket = new WebSocket(
      `ws://${addr}:${port}`,
      spectator ? CLIENTS.SPECTATOR : CLIENTS.PLAYER
    );
    this.socket.onmessage = event => {
      const msg: INetworkMsg = JSON.parse(event.data);
      if (!msg.trueState) {
        if (msg.data.type === NetworkMsgTypes.SET_TICK) {
          this.scene.setTick(msg.data.tick - 1);
        }
        this.scene.checkTick(msg.data.tick);
        if (msg.data.type === NetworkMsgTypes.ACTION){
          this.scene.applyMessage( {action: msg.data.action})
        }else if (msg.data.type === NetworkMsgTypes.CREATE){
          this.scene.applyMessage({objToCreate: msg.data.gameObject})
        }else if (msg.data.type === NetworkMsgTypes.DELETE){
          this.scene.applyMessage({objToDelete: msg.data.gameObject})
        } else if (msg.data.type === NetworkMsgTypes.STATE) {
          this.scene.addServerState(msg.data.tick, msg.data.gameObjects!);
        }
      } else {
        this.scene.setTickTrue(msg.data.tick);
        this.updateGameObjectsTrue(msg.data.gameObjects!);
      }
    };
    this.socket.onclose = () => {
      this.scene.scene.start(SceneTypes.MENU);
    };
  }

  close = () => {
    this.socket.close();
  };

  moveTo = (x: number, y: number) => {
    this.socket.send(JSON.stringify({ action: ACTIONS.MOVE, x, y }));
  };

  rocketTo = (x: number, y: number) => {
    this.socket.send(JSON.stringify({ action: ACTIONS.ROCKET, x, y }));
  };

  bulletTo = (x: number, y: number) => {
    this.socket.send(JSON.stringify({ action: ACTIONS.BULLET, x, y }));
  };

  updateGameObjects = (objects: IGameObject[]) => {
    this.scene.clearGameObjects();
    objects.forEach(obj =>
      this.scene.addGameObject(
        gameObjectfromIGameObject(obj, this.scene.graphics!)
      )
    );
  };

  updateGameObjectsTrue = (objects: IGameObject[]) => {
    this.scene.clearGameObjectsTrue();
    objects.forEach(obj =>
      this.scene.addGameObjectTrue(
        gameObjectfromIGameObject(obj, this.scene.graphics!, true)
      )
    );
  };
}
