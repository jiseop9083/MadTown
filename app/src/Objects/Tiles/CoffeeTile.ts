import { GroundTile } from "./GroundTile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";
import { shareScreen } from "../../Page/ScreenShare";
import { startMiniGame } from "../../Components/MiniGame";

            
export class CoffeeTile extends GroundTile {
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

    openEvent(scene: GameScene, isPress: boolean) {
        if(!isPress) return;
        if(scene.eventTimer == 0){
            scene.eventTimer = 120;
            startMiniGame();
        }
    }

    
}