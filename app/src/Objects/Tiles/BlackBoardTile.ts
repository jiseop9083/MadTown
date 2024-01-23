import { Tile } from "./Tile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";
import { createBlackBoard } from "../../Page/BlackBoard";

            
export class BlackBoardTile extends Tile {
    scene: Phaser.Scene;
    size: number;
    id: number;
  
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string, 
        id: number
    ) {
        super(scene, x , y + 0.25, texture, id);
        this.setDisplaySize(32, 16);
    };

    onCollision(player: Player) {
        super.onCollision(player);
        player.x = player.previousX;
        player.y = player.previousY;
    };

    openEvent(scene: GameScene, isPress: boolean) {
        if(!isPress) return;
        //const game = window.game.scene.keys.GameScene as GameScene;
        const mainDiv = document.getElementById('main') as HTMLDivElement;
        createBlackBoard(scene, mainDiv);
    }

    
}