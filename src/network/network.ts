import { SceneTypes } from "../config";
import GameScene from "../game/Scene";
import { ACTIONS, CLIENTS, IGameState, INetworkMsg } from "./networkTypes";
import { bulletFromIBullet, playerFromIPlayer, rocketFromIRocket } from "./utils";

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
        this.updateGameObjects(msg.gameState);
      } else {
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
    msg.players.forEach(player =>
      this.scene.addGameObject(playerFromIPlayer(player, this.scene.graphics!))
    );
    msg.rockets.forEach(rocket =>
      this.scene.addGameObject(rocketFromIRocket(rocket, this.scene.graphics!))
    );
    msg.bullets.forEach(bullet =>
      this.scene.addGameObject(bulletFromIBullet(bullet, this.scene.graphics!))
    );
  };

  updateGameObjectsTrue = (msg: IGameState) => {
    this.scene.clearGameObjectsTrue();
    msg.players.forEach(player =>
      this.scene.addGameObjectTrue(playerFromIPlayer(player, this.scene.graphics!, true))
    );
    msg.rockets.forEach(rocket =>
      this.scene.addGameObjectTrue(rocketFromIRocket(rocket, this.scene.graphics!, true))
    );
    msg.bullets.forEach(bullet =>
      this.scene.addGameObjectTrue(bulletFromIBullet(bullet, this.scene.graphics!, true))
    );
  };
}
