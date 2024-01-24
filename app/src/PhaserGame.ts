import { Coffee } from "./Page/Coffee";
import { GameScene } from "./Page/Game";
import Color from "./types/Color";


const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

let phaserGame: Phaser.Game;

// game config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    backgroundColor: Color.transparent,
    parent: 'gameAndChat',
    physics: { default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 }
        } 
    },
    pixelArt: true,
    scene: [ GameScene, Coffee ],
};


export function createGame() {
  try{
    phaserGame = new Phaser.Game(config)
    ;(window as any).game = phaserGame
   
  } catch(e){
    throw new Error('Function not implemented.');
  }
}

export function pauseGame() {
  if (phaserGame) {
    phaserGame.scene.pause('GameScene');
  } else {
    throw new Error('Game instance not defined.');
  }
}

export function resumeGame() {
  if (phaserGame) {
    phaserGame.scene.resume('GameScene');
  } else {
    throw new Error('Game instance not defined.');
  }
}



export default phaserGame;