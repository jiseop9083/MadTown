import Phaser from "phaser";
import { Player } from "../Player";

export class Tile extends Phaser.GameObjects.Sprite {
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
        super(scene, x * 32 + 16, y * 32 + 16, texture);
        this.scene = scene;
        this.id = id;
        this.setAlpha(0);
    };

    onCollision(player: Player) {

    };
}