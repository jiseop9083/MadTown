import { Tile } from "./Tile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";
            
export class ChairTile extends Tile {
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
    };

    openEvent(scene: GameScene, isPress: boolean) {};
}