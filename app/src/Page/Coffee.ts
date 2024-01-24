// coffee game since
import { Scene } from "phaser";
import { Client, Room } from "colyseus.js";
import { TagManager } from "../util/TagManager";
import Color from "../types/Color";
import { GamblePlayer } from "../Objects/GamblePlayer";


const dotenv = require('dotenv');
dotenv.config();

const HTTP_SERVER_URI = process.env.MOCK_HTTP_SERVER_URI;
const SERVER_URI = process.env.MOCK_SERVER_URI;
const tagManager = TagManager.getInstance();

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

declare let playerName: string;

// custom scene class
export class Coffee extends Scene {
    constructor() {
        super({ key: 'Coffee' });
    }
    client = new Client(`${SERVER_URI}`);

    room: Room;
    map: Phaser.Tilemaps.Tilemap;
    backgroundLayer: Phaser.Tilemaps.TilemapLayer;
    ojbectGroup: Phaser.Physics.Arcade.Group; // 오브젝트 그룹(책상 등등)
    playerGroup: Phaser.Physics.Arcade.Group;
    playerEntities: {[sessionId: string]: any} = {};
    gamers: {[sessionId: string]: boolean} = {};
    loserNumber: number;
    currentPlayer: GamblePlayer;
    gameTimer: number;
    textTimer: Phaser.GameObjects.Text;
    waringText: Phaser.GameObjects.Text;
    rock: HTMLElement;
    scissors: HTMLElement;
    paper: HTMLElement;
    notSelectPerson: string;

    preload() {
        try {
            // this.load.audio("backgroundSound", require('../../assets/sounds/background_music.mp3'));
            this.load.image('coffe_tiles', `${HTTP_SERVER_URI}/image/tiles-coffee_map.png`);
            this.load.spritesheet(`coffe_tile_set`, `${HTTP_SERVER_URI}/image/tiles-coffee_map.png`, { frameWidth: 32, frameHeight: 32 });
            this.load.tilemapTiledJSON('coffeeGambling', `${HTTP_SERVER_URI}/json/tiles-coffeeGambling.json`);
            this.load.spritesheet(`paper_go`, `${HTTP_SERVER_URI}/image/rps-paper_go.png`, { frameWidth: 32, frameHeight: 64 });
            this.load.spritesheet(`scissors_go`, `${HTTP_SERVER_URI}/image/rps-scissors_go.png`, { frameWidth: 32, frameHeight: 64 });
            this.load.spritesheet(`rock_go`, `${HTTP_SERVER_URI}/image/rps-rock_go.png`, { frameWidth: 32, frameHeight: 64 });
            this.load.spritesheet(`paper_ready`, `${HTTP_SERVER_URI}/image/rps-paper_ready.png`, { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet(`scissors_ready`, `${HTTP_SERVER_URI}/image/rps-scissors_ready.png`, { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet(`rock_ready`, `${HTTP_SERVER_URI}/image/rps-rock_ready.png`, { frameWidth: 32, frameHeight: 32 });
        } catch (e) {
        console.error(e);
        }
    }
  
    async create() {
        console.log("Joining room...");
        try{
            this.room = await this.client.joinOrCreate("coffee_room", {name: playerName});
            this.map = this.make.tilemap({ key: 'coffeeGambling' });
            const tileset = this.map.addTilesetImage('coffee_map', 'coffe_tiles');
            this.backgroundLayer = this.map.createLayer("background", tileset, 0,0);
            this.gameTimer = 0;
            this.loserNumber = 0;
            

            //맵의 크기를 이미지의 크기로 조절
            this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            this.cameras.main.setSize(1000, 600);
            this.cameras.main.setZoom(2.675);
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
            this.textTimer = this.add.text(32 * 5.5, 32 * 3.5, "", {
                color: Color.red,
                fontSize: '128px',
                fontStyle: 'bold',
            });
            this.textTimer.setOrigin(0.5, 0.5);
            this.waringText = this.add.text(32 * 5.5, 32 * 3.5, "", {
                color: Color.yellow,
                fontSize: '12px',
            });
            this.waringText.setOrigin(0.5, 0.5);

            this.cameras.main.setSize(MAP_WIDTH, MAP_HEIGHT);
            this.cameras.main.setZoom(2.675);
            this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
            
            
            
            this.playerGroup = this.physics.add.group();
            this.physics.world.enable(this.playerGroup);

            

            this.room.state.gamblePlayers.onAdd((gamblePlayer, sessionId) => {
                const entity = new GamblePlayer(this, gamblePlayer.x, gamblePlayer.y, 'rock', sessionId, gamblePlayer.name, gamblePlayer.number);
               // const entity = this.physics.add.image(gamblePlayer.x, gamblePlayer.y, 'rock_ready');
                
                
                this.playerGroup.add(entity);
                this.playerEntities[sessionId] = entity;
                this.gamers[sessionId] = true;
                this.loserNumber++;
                this.rock = document.getElementById('rock');
                this.scissors = document.getElementById('scissors');
                this.paper = document.getElementById('paper');
 
                if (sessionId === this.room.sessionId) {
                    this.currentPlayer = entity;
                    this.currentPlayer.playerName.setStyle({fill: Color.red});
                } 
            });

            this.room.onMessage("gameStart", (messageData) => {
                const { playerId, gameTimer } = messageData;
                this.gameTimer = gameTimer;
                this.room.send("setState", {
                    "state": 0,
                });
                this.currentPlayer.initState();
                this.waringText.text = '';
            });

            this.room.onMessage("setState", (messageData) => {
                const { playerId, state } = messageData;
                for (let sessionId in this.playerEntities) {
                    if(sessionId == playerId){
                        if(this.gamers[sessionId]){
                            const entity = this.playerEntities[sessionId];
                            entity.state = state;
                            if(state == 0){
                                entity.initState();
                            }
                            if(sessionId == this.room.sessionId){
                                this.currentPlayer.changeState(state);
                            }
                            console.log(entity.playerName.text);
                            if(this.notSelectPerson == entity.playerName.text){
                                this.waringText.text = '';
                                this.notSelectPerson = '';
                                this.startRPS();
                            }
                        }
                    }
                }
                
                this.rock.style.backgroundColor = Color.primary;
                this.scissors.style.backgroundColor = Color.primary;
                this.paper.style.backgroundColor = Color.primary;
            });

        } catch (e) {
            console.error(e);
        }
    }
    onLeave(player){
        
    }

 

    elapsedTime = 0;
    fixedTimeStep = 1000 / 60;

    // game loop
    update(time: number, delta: number): void {
        // skip loop if not connected with room yet.
        if (!this.currentPlayer) { return; }
        this.elapsedTime += delta;
        while (this.elapsedTime >= this.fixedTimeStep) {
            this.elapsedTime -= this.fixedTimeStep;
            this.fixedTick(time, this.fixedTimeStep);
        }
        
    }

    fixedTick(time, timeStep) {
        if(this.gameTimer == 180){
            this.textTimer.text = '3';
        }
        if(this.gameTimer == 120){
            this.textTimer.text = '2';
        }
        if(this.gameTimer == 60){
            this.textTimer.text = '1';
        }
        if(this.gameTimer == 1){
            this.textTimer.text = '';
            this.startRPS();
        }
        if(this.gameTimer > 0)
            this.gameTimer--;
        if(this.currentPlayer.state == 1)
            this.rock.style.backgroundColor = Color.darkPrimary;
        if(this.currentPlayer.state == 2)
            this.scissors.style.backgroundColor = Color.darkPrimary;
        if(this.currentPlayer.state == 3)
            this.paper.style.backgroundColor = Color.darkPrimary;
    }


    startRPS() {
        let isSelected = true;
        for (let sessionId in this.playerEntities) {
            if(this.gamers[sessionId] == true && this.playerEntities[sessionId].state == 0 ){
                this.notSelectPerson = this.playerEntities[sessionId].playerName.text;
                isSelected = false;
                break;
            }
        }
        if(isSelected) {
            // this.loserNumber;
            let rpsNumber = [0, 0, 0];
            for (let sessionId in this.playerEntities) {
                const entity = this.playerEntities[sessionId];
                if(this.gamers[sessionId]){
                    entity.goState(true);
                    rpsNumber[entity.state - 1]++;
                }
                
            }
            if(rpsNumber[0] > 0 && rpsNumber[1] > 0 && rpsNumber[2] == 0){ // rock
                for (let sessionId in this.playerEntities) {
                    if(this.playerEntities[sessionId].state - 1 == 0){
                        this.loserNumber--;
                        this.gamers[sessionId] = false;
                        this.playerEntities[sessionId].playerName.setStyle({fill: Color.yellow});
                    }
                }
            } else if(rpsNumber[1] > 0 && rpsNumber[2] > 0 && rpsNumber[0] == 0){ //sessier
                for (let sessionId in this.playerEntities) {
                    if(this.playerEntities[sessionId].state - 1 == 1){
                        this.loserNumber--;
                        this.gamers[sessionId] = false;
                        this.playerEntities[sessionId].playerName.setStyle({fill: Color.yellow});
                    }
                }
            } else if(rpsNumber[2] > 0 && rpsNumber[0] > 0 && rpsNumber[1] == 0){ //paper
                for (let sessionId in this.playerEntities) {
                    if(this.playerEntities[sessionId].state - 1 == 2){
                        this.loserNumber--;
                        this.gamers[sessionId] = false;
                        this.playerEntities[sessionId].playerName.setStyle({fill: Color.yellow});
                    }
                }
            }
            console.log(this.loserNumber);
            if(this.loserNumber <= 1){
                for (let sessionId in this.playerEntities) {
                    if(this.gamers[sessionId]){
                        this.waringText.text = `${this.playerEntities[sessionId].playerName.text} is loser!!`
                    } else{
                        this.gamers[sessionId] = true;
                        this.playerEntities[sessionId].playerName.setStyle({fill: Color.white});
                        this.loserNumber++;
                    }
                    
                }
                this.currentPlayer.playerName.setStyle({fill: Color.red});
            }
        } else {
            this.waringText.text = `${this.notSelectPerson}: please choose !!`;
        }
    }
}