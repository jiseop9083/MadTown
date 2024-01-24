import Phaser from 'phaser'
import { PlayerState } from '../types/PlayerState';

declare var currentIndex: number;

export class Player extends Phaser.Physics.Arcade.Sprite {
    playerId: string;
    playerTexture: string;
    playerState = PlayerState.IDLE;
    playerNumber: number;
    roomName: string;
    playerName: Phaser.GameObjects.Text;
    playerContainer: Phaser.GameObjects.Container;
    scene: Phaser.Scene;
    previousX: number;
    previousY: number;
    size: number;
    isSit: boolean;
    sitCounter: number;
    isCollision: boolean;
    // private playerDialogBubble: Phaser.GameObjects.Container;
  
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string, // player animation sprite name
        id: string,
        size: number = 1,
        frame?: string | number
    ) {
        super(scene, x, y, `avatar${texture}`, frame);
        this.scene = scene;
        scene.add.existing(this);
        this.playerId = id;
        this.playerTexture = `avatar${texture}`;
        this.playerNumber = Number(texture) * 6 - 1;
        this.anims.play(`${this.playerTexture}_idle`);
        this.size = size * 32;
        this.setDisplaySize(this.size, this.size);
        this.isSit = false;
        this.sitCounter = 0;
        this.roomName = "";
        this.playerContainer = this.scene.add.container(this.x, this.y);
        this.scene.physics.world.enable(this.playerContainer);
        const playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
        playContainerBody.setSize(this.width * 0.5, this.height * 0.74);
    };

    update = () => {
        if(this.sitCounter > 0)
            this.sitCounter--;
        if(this.isSit)
            return;
        this.playerContainer.x = this.x + this.size * 0.26;
        this.playerContainer.y = this.y + this.size * 0.13;
        
    }
    

    changeAnims = (state : PlayerState) => {
        switch(state){
            case PlayerState.IDLE:
                if(this.playerState != PlayerState.IDLE){
                    this.anims.play(`${this.playerTexture}_idle`);
                    this.playerState = PlayerState.IDLE;
                }
                    
                break;
            case PlayerState.DOWN:
                if(this.playerState != PlayerState.DOWN){
                    this.anims.play(`${this.playerTexture}_front`);
                    this.playerState = PlayerState.DOWN;
                }
                break;
            case PlayerState.UP:
                if(this.playerState != PlayerState.UP){
                    this.anims.play(`${this.playerTexture}_back`);
                    this.playerState = PlayerState.UP;
                }
                break;
            case PlayerState.RIGHT:
                if(this.playerState != PlayerState.RIGHT){
                    this.anims.play(`${this.playerTexture}_right`);
                    this.playerState = PlayerState.RIGHT;
                }
                break;
            case PlayerState.LEFT:
                if(this.playerState != PlayerState.LEFT){
                    this.anims.play(`${this.playerTexture}_left`);
                    this.playerState = PlayerState.LEFT;
                }
                break;
            default:
                if(this.playerState != PlayerState.IDLE){
                    this.anims.play(`${this.playerTexture}_idle`);
                    this.playerState = PlayerState.IDLE;
                }
                break;
        }
    }
}