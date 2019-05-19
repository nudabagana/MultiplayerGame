import "phaser";

type GameConfig = Phaser.Types.Core.GameConfig;

const config: GameConfig = {
  title: "Multiplayer Game",
  width: 800,
  height: 600,
  parent: "game",
  backgroundColor: "#18216D"
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new Game(config);
};