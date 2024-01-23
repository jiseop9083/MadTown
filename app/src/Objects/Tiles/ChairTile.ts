import { Tile } from "./Tile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";

            
export class ChairTile extends Tile {
    scene: Phaser.Scene;
    size: number;
    id: number;
    overlapTile: Phaser.GameObjects.Sprite;
  
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

    openEvent(scene: GameScene, isPress: boolean) {
        if(!this.overlapTile){
            let tile = scene.groundLayer.getTileAt(this.indexX, this.indexY);
            this.overlapTile = scene.add.sprite(tile.pixelX + 16, tile.pixelY + 16, 'tile_set', scene.currentPlayer.playerNumber);
            this.overlapTile.setAlpha(0);
        }
        if(!isPress)
            return;
        if(!scene.currentPlayer.isSit && scene.currentPlayer.sitCounter <= 0){
            scene.currentPlayer.isSit = true;
            scene.currentPlayer.setAlpha(0);
            this.overlapTile.setAlpha(1);
            scene.currentPlayer.sitCounter = 60;
        } else if(scene.currentPlayer.isSit && scene.currentPlayer.sitCounter <= 0) {
            scene.currentPlayer.isSit = false;
            scene.currentPlayer.sitCounter = 60;
            scene.currentPlayer.setAlpha(1);
            this.overlapTile.setAlpha(0);
            
        }
    };
}