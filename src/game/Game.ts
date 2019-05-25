import "phaser";
import { windowSize } from "../config";
import GameScene from "./GameScene";
import MenuScene from "./MenuScene";

export const createGame = () => {
  const gameScene = new GameScene();
  const menuScene = new MenuScene();
  const config = {
    title: "Multiplayer Game",
    width: windowSize.width,
    height: windowSize.height,
    parent: "game",
    backgroundColor: "#c5d1e5",
    scene: [menuScene, gameScene],
    antialias: true,
    clearBeforeRender: true,
  };

  const game = new Phaser.Game(config);
};
