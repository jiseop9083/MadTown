import { Tile } from "./Tile";
import { Player } from "../Player";
import { GameScene } from "../../Page/Game";

            
export class ChairTile extends Tile {
    size: number;
    overlapTile: Phaser.GameObjects.Sprite;
    hasPlayer: boolean;
  
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string, 
        tileType: number,
        id: number
    ) {
        super(scene, x, y, texture, tileType, id);
        this.hasPlayer = false;
    };

    onCollision(player: Player) {
        super.onCollision(player);
        
    };

    openEvent(scene: GameScene, isPress: boolean) {
        if(!isPress)
            return;
        if(!scene.currentPlayer.isSit && scene.currentPlayer.sitCounter <= 0 && !this.hasPlayer){
            scene.currentPlayer.isSit = true;
            // scene.currentPlayer.setAlpha(0);
            // this.overlapTile.setAlpha(1);
            scene.room.send("sit", {
                "tileId": this.id,
                "setSit": true,
                "hasPlayer": true,
              });
            this.hasPlayer = true;
            scene.currentPlayer.sitCounter = 60;
        } else if(scene.currentPlayer.isSit && scene.currentPlayer.sitCounter <= 0 && this.hasPlayer) {
            scene.currentPlayer.isSit = false;
            scene.room.send("sit", {
                "tileId": this.id,
                "setSit": false,
                "hasPlayer": false,
              });
            this.hasPlayer = false;
            scene.currentPlayer.sitCounter = 60
        }
    };

    setSit(playerNumber: number, playerId: string){
        if(!this.overlapTile){
            let tile = this.scene.groundLayer.getTileAt(this.indexX, this.indexY);
            this.overlapTile = this.scene.add.sprite(tile.pixelX + 16, tile.pixelY + 16, 'tile_set', playerNumber);
            this.overlapTile.setAlpha(0);
        }
        this.overlapTile.setAlpha(1);
        // player invisible
        for (let sessionId in this.scene.playerEntities) {
            if (sessionId == playerId) {
              const entity = this.scene.playerEntities[sessionId];
              entity.setAlpha(0);
              continue;
            }
        }
    }

    setStand(playerNumber: number, playerId: string){
        console.log("ddd");
        this.overlapTile.setAlpha(0);
        // player invisible
        for (let sessionId in this.scene.playerEntities) {
            if (sessionId == playerId) {
              const entity = this.scene.playerEntities[sessionId];
              entity.setAlpha(1);
              continue;
            }
        }
    }
}