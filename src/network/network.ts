import { player1Color, player2Color } from "../config";
import GameScene from "../game/Scene";
import { ACTIONS, CLIENTS, NetworkMsg } from "./networkTypes";

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
      const msg: NetworkMsg = JSON.parse(event.data);
      this.scene.clearPlayers();
      this.scene.clearRockets();
      this.scene.clearBullets();
      msg.players.forEach(player =>
        this.scene.addPlayer(
          player.id,
          player.x,
          player.y,
          player.id === 1 ? player1Color : player2Color,
          player.health
        )
      );
      msg.rockets.forEach(rocket =>
        this.scene.addRocket(
          rocket.id,
          rocket.playerId === 1 ? player1Color : player2Color,
          rocket.x,
          rocket.y
        )
      );
      msg.bullets.forEach(bullet =>
        this.scene.addBullet(
          bullet.id,
          bullet.playerId === 1 ? player1Color : player2Color,
          bullet.x,
          bullet.y
        )
      );
    };
  }

  moveTo = (x: number, y: number) => {
    this.socket.send(JSON.stringify({ action: ACTIONS.MOVE, x, y }));
  };

  rocketTo = (x: number, y: number) => {
    this.socket.send(JSON.stringify({ action: ACTIONS.ROCKET, x, y }));
  };

  bulletTo = (x: number, y: number) => {
    this.socket.send(JSON.stringify({ action: ACTIONS.BULLET, x, y }));
  };
}
