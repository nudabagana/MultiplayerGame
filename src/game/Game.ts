import "phaser";
import { windowSize } from "../config";
import GameScene from "./Scene";

export const createGame = () => {
  const scene = new GameScene();
  const config = {
    title: "Multiplayer Game",
    width: windowSize.width,
    height: windowSize.height,
    parent: "game",
    backgroundColor: "#c5d1e5",
    scene: [scene],
    antialias: true,
    clearBeforeRender: true,
  };

  const game = new Phaser.Game(config);
};
