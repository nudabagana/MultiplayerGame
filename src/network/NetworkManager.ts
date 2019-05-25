import { SceneTypes } from "../config";
import GameScene from "../game/GameScene";
import { ACTIONS, CLIENTS, IGameState, INetworkMsg } from "./NetworkTypes";
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
        this.scene.setTick(msg.gameState.tick);
        this.updateGameObjects(msg.gameState);
      } else {
        this.scene.setTickTrue(msg.gameState.tick);
        this.updateGameObjectsTrue(msg.gameState);
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

  updateGameObjects = (msg: IGameState) => {
    this.scene.clearGameObjects();
    msg.gameObjects.forEach(obj =>
      this.scene.addGameObject(
        gameObjectfromIGameObject(obj, this.scene.graphics!)
      )
    );
  };

  updateGameObjectsTrue = (msg: IGameState) => {
    this.scene.clearGameObjectsTrue();
    msg.gameObjects.forEach(obj =>
      this.scene.addGameObjectTrue(
        gameObjectfromIGameObject(obj, this.scene.graphics!, true)
      )
    );
  };
}
