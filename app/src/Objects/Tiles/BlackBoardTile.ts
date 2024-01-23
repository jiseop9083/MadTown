import { Tile } from "./Tile";
import { Player } from "../Player";

            
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
        console.log(player);
        player.x = player.previousX;
        player.y = player.previousY;
    };
}