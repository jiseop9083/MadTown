import { GroundTile } from "./GroundTile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";
import { shareScreen } from "../../Page/ScreenShare";

            
export class ComputerTile extends GroundTile {
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
        //const game = window.game.scene.keys.GameScene as GameScene;
        if(scene.eventTimer == 0){
            scene.eventTimer = 120;
            const mainDiv = document.getElementById('main') as HTMLDivElement;
            scene.addInputListener();
            shareScreen(scene, scene.currentPlayer, mainDiv);
        }
    }

    
}