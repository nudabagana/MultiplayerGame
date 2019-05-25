import GameScene from "../game/GameScene";

export default class InputPlayer {
  scene: GameScene;
  constructor(scene: GameScene) {
    this.scene = scene;
  }

  setupPosition = () => {
    this.scene.moveClick(100, 100);
  };

  playInput1 = () => {
    this.scene.bulletClick(500, 400);
  };

  playInput2 = () => {
    this.scene.rocketClick(500, 400);
  };

  playInput3 = () => {
    this.scene.moveClick(900, 100);
    setTimeout(() => this.scene.bulletClick(500, 400), 3000);
  };

  playInput4 = () => {
    this.scene.moveClick(900, 100);
    setTimeout(() => this.scene.rocketClick(500, 400), 3000);
  };

  playInput5 = () => {
    this.scene.moveClick(900, 100);
  };

  playInput6 = () => {
    this.scene.moveClick(900, 100);
    const intervalId = setInterval(() => {
      const player = this.scene.getPlayers().filter(p => p.id === 1)[0];
      if (player && Math.abs(player.x -900 ) < 10 && Math.abs(player.y - 100) < 10){
        this.scene.moveClick(100, 100);
        clearInterval(intervalId);
      }
    }, 20);
  };

  playInput7 = () => {
    this.scene.moveClick(900, 100);
    const intervalId = setInterval(() => {
      const player = this.scene.getPlayers().filter(p => p.id === 1)[0];
      if (player && Math.abs(player.x -900 ) < 10 && Math.abs(player.y - 100) < 10) {
        clearInterval(intervalId);
        setTimeout(() => {
          this.scene.moveClick(100, 100);
        }, 2000);
      }
    }, 20);
  };

  playInput8 = () => {
    this.scene.moveClick(900, 100);
    const intervalId = setInterval(() => {
      const player = this.scene.getPlayers().filter(p => p.id === 1)[0];
      if (player && Math.abs(player.x -900 ) < 10 && Math.abs(player.y - 100) < 10) {
        clearInterval(intervalId);
        this.scene.moveClick(900, 700);
      }
    }, 20);
  };

  playInput9 = () => {
    this.scene.moveClick(900, 100);
    const intervalId = setInterval(() => {
      const player = this.scene.getPlayers().filter(p => p.id === 1)[0];
      if (player && Math.abs(player.x -900 ) < 10 && Math.abs(player.y - 100) < 10) {
        clearInterval(intervalId);
        setTimeout(() => {
          this.scene.moveClick(900, 700);
        }, 2000);
      }
    }, 20);
  };
}
