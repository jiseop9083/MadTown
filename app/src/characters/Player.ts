import Phaser from 'phaser'
import { PlayerState } from '../types/PlayerState';

declare var currentIndex: number;

export class Player extends Phaser.Physics.Arcade.Sprite {
    playerId: string;
    playerTexture: string;
    playerState = PlayerState.IDLE;
    roomName: string;
    // readyToConnect = false;
    // videoConnected = false;
    playerName: Phaser.GameObjects.Text;
    playerContainer: Phaser.GameObjects.Container;
    scene: Phaser.Scene;
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
        super(scene, x, y, texture, frame);
        this.scene = scene;
        scene.add.existing(this);
       // scene.physics.add.existing(this);
        this.playerId = id;
        this.playerTexture = texture;
        // this.setDepth(this.y);
        this.anims.play(`${this.playerTexture}_idle`);
        this.setScale(size);
        this.playerContainer = this.scene.add.container(this.x, this.y - 30).setDepth(5000);
        this.roomName = "";
        
        this.scene.physics.world.enable(this.playerContainer);
        // const playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
        // const collisionScale = [0.8, 0.8];
        // playContainerBody.setSize(this.width * collisionScale[0], this.height * collisionScale[1])//.setOffset(-8, this.height * (1 - collisionScale[1]) + 6);
    };
        

    debugMode = (mode : boolean) => {
        if(mode){
            this.scene.remoteRef = this.scene.add.rectangle(0, 0, this.width, this.height);
            this.scene.remoteRef.setStrokeStyle(1, 0xff0000);
        }
    };

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