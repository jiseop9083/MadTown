import { Tile } from "./Tile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";
            
export class GroundTile extends Tile {
    size: number;
  
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string, 
        tileType: number,
        id: number
    ) {
        super(scene, x, y, texture, tileType, id);
    };

    onCollision(player: Player) {
        super.onCollision(player);
        player.x = player.previousX;
        player.y = player.previousY;
    };

    openEvent(scene: GameScene, isPress: boolean) {};
}