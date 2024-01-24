import Phaser from 'phaser';

const go = [
    {x: 0, y: -16},
    {x: -16, y: 0},
    {x: 0, y: 16},
    {x: 16, y: 0},
];

const RPS = ['rock', 'scissors', 'paper'];


export class GamblePlayer extends Phaser.Physics.Arcade.Sprite {
    playerId: string;
    playerName: Phaser.GameObjects.Text;
    scene: Phaser.Scene;
    isReady: boolean;
    state: number; // 1 rock, 2 sessior, 3 paper
    playerTexture: string; 
    playerNumber: number;
    basicX: number;
    basicY: number;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string, // player animation sprite name
        id: string,
        number: number,
        frame?: string | number
    ) {
        super(scene, x, y, `${texture}_ready`, frame);
        this.state = 0;
        this.playerTexture = texture;
        this.scene = scene;
        scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.angle = -number * 90;
        this.playerNumber = number;
        this.playerId = id;
        this.basicX = x;
        this.basicY = y;
        
    };

    changeState(state) {
        this.state = state;
        if(this.state == 0){
            this.setTexture(`rock_ready`);
        } else{
            this.playerTexture = RPS[this.state - 1];
            this.setTexture(`${this.playerTexture}_ready`);
        }
       
    }

    goState(isReady: boolean) {
        this.isReady = isReady;
        this.playerTexture = RPS[this.state - 1];
        this.setTexture(`${this.playerTexture}_go`);
        this.x += go[(this.playerNumber % 4)].x;
        this.y += go[(this.playerNumber % 4)].y; 
    }

    initState(){
        this.state = 0;
        this.setTexture(`rock_ready`);
        this.x = this.basicX;
        this.y = this.basicY;
    }

    update() {
       
    }
}