import "phaser";
import { menuBckColor, SceneTypes } from "../config";
import { CLIENTS } from "../network/NetworkTypes";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MenuScene",
    });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(menuBckColor);
    this.input.mouse.disableContextMenu();
    const gameName = this.add.text(100, 150, 'The Multiplayer Game', { fill: '#06d3c9', font: '50pt'  });
    const startButton = this.add.text(325, 550, 'Start Game!', { fill: '#06d3c9', font: '40pt'  });
    startButton.setInteractive();
    startButton.on('pointerdown', () => { this.scene.start(SceneTypes.GAME, { client: CLIENTS.PLAYER }); });

    const spectateButton = this.add.text(348, 420, 'Spectate!', { fill: '#06d3c9', font: '40pt'  });
    spectateButton.setInteractive();
    spectateButton.on('pointerdown', () => { this.scene.start(SceneTypes.GAME, { client: CLIENTS.SPECTATOR }); });
  }
}
