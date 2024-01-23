import { Tile } from "./Tile";
import { Player } from "../Player";

            
export class GroundTile extends Tile {
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
        super(scene, x, y, texture, id);
    };

    onCollision(player: Player) {
        super.onCollision(player);
        console.log(player);
        player.x = player.previousX;
        player.y = player.previousY;
    };
}