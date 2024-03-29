import { Tile } from "./Tile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";
import { createBlackBoard } from "../../Page/BlackBoard";

            
export class BlackBoardTile extends Tile {
    size: number;
  
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string, 
        tileType: number,
        id: number
    ) {
        super(scene, x , y + 0.25, texture, tileType, id);
        this.setDisplaySize(32, 16);
    };

    onCollision(player: Player) {
        super.onCollision(player);
        player.x = player.previousX;
        player.y = player.previousY;
    };

    openEvent(scene: GameScene, isPress: boolean) {
        if(!isPress) return;
        if(scene.eventTimer == 0){
            scene.eventTimer = 120;
            const mainDiv = document.getElementById('main') as HTMLDivElement;
            createBlackBoard(scene, mainDiv);
        }
    }

    
}