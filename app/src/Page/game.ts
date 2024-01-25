import { Scene } from "phaser";
import { Client, Room } from "colyseus.js";
import { Keyboard, Keys } from "../types/KeyboardState";

import { createCharacterAnims } from "../anims/CharacterAnims";
import { Player } from "../Objects/Player";
import { PlayerState } from "../types/PlayerState";
import { TagManager } from "../util/TagManager";
import Color from "../types/Color";
import { GroundTile, ChairTile, BlackBoardTile, ComputerTile, CoffeeTile, Tile } from "../Objects/Tiles";


const dotenv = require('dotenv');
dotenv.config();

const HTTP_SERVER_URI = process.env.HTTP_SERVER_URI;
const SERVER_URI = process.env.SERVER_URI;
const tagManager = TagManager.getInstance();

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

declare let currentIndex: number;
declare let playerName: string;

// custom scene class
export class GameScene extends Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    this.load.audio("backgroundSound", `${HTTP_SERVER_URI}/audio/sounds-background_music.mp3`)

    this.load.image('tiles', `${HTTP_SERVER_URI}/image/tiles-tile_map.png`);
    this.load.spritesheet(`tile_set`, `${HTTP_SERVER_URI}/image/tiles-tile_map.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet(`santa`, `${HTTP_SERVER_URI}/image/player-mountainUp.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet(`avatar1_idle`, `${HTTP_SERVER_URI}/image/player-character1_idle.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar1_front', `${HTTP_SERVER_URI}/image/player-character1_front.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar1_back', `${HTTP_SERVER_URI}/image/player-character1_back.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar1_right', `${HTTP_SERVER_URI}/image/player-character1_right.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar1_left', `${HTTP_SERVER_URI}/image/player-character1_left.png`, { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('avatar2_idle', `${HTTP_SERVER_URI}/image/player-character2_idle.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar2_front', `${HTTP_SERVER_URI}/image/player-character2_front.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar2_back', `${HTTP_SERVER_URI}/image/player-character2_back.png`, { frameWidth: 32, frameHeight: 32 }); 
    this.load.spritesheet('avatar2_right', `${HTTP_SERVER_URI}/image/player-character2_right.png`, { frameWidth: 32, frameHeight: 32 }); 
    this.load.spritesheet('avatar2_left', `${HTTP_SERVER_URI}/image/player-character2_left.png`, { frameWidth: 32, frameHeight: 32 }); 

    this.load.spritesheet('avatar3_idle', `${HTTP_SERVER_URI}/image/player-character3_idle.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar3_front', `${HTTP_SERVER_URI}/image/player-character3_front.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar3_back', `${HTTP_SERVER_URI}/image/player-character3_back.png`, { frameWidth: 32, frameHeight: 32 }); 
    this.load.spritesheet('avatar3_right', `${HTTP_SERVER_URI}/image/player-character3_right.png`, { frameWidth: 32, frameHeight: 32 }); 
    this.load.spritesheet('avatar3_left', `${HTTP_SERVER_URI}/image/player-character3_left.png`, { frameWidth: 32, frameHeight: 32 }); 
    this.load.tilemapTiledJSON('classroom', `${HTTP_SERVER_URI}/json/tiles-classroom.json`);
    this.cursor = {
      ...this.input.keyboard.createCursorKeys(),
      ...(this.input.keyboard.addKeys('W,S,A,D,E,R') as Keyboard),
    }
    
  }

  client = new Client(`${SERVER_URI}`);

  room: Room;

  ojbectGroup: Phaser.Physics.Arcade.Group; // 오브젝트 그룹(책상 등등)
  playerGroup: Phaser.Physics.Arcade.Group;
  playerEntities: {[sessionId: string]: any} = {};
  tileEntities: {[tileId: number]: Tile} = {};
  currentPlayer: Player;
  remoteRef: Phaser.GameObjects.Rectangle;
  map: Phaser.Tilemaps.Tilemap;
  backgroundLayer: Phaser.Tilemaps.TilemapLayer;
  groundLayer: Phaser.Tilemaps.TilemapLayer;
  metaDataLayer: Phaser.Tilemaps.TilemapLayer;
  chatOnFocus: boolean;
  shareOnFocus: boolean;
  videoOnFocus: boolean;
  chatInput: HTMLElement;
  videoInput: HTMLElement;
  screenShareInput: HTMLElement;
  capsLockOn: boolean;

  chatTimer: number;
  eventTimer: number;
  backgroundSND: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound

  cursor: Keys;
  
  inputPayload = {
      left: false,
      right: false,
      up: false,
      down: false,
      A: false,
      W: false,
      S: false,
      D: false,
      E: false,
      R: false,
  };

  async create() {
    console.log("Joining room...");

    

    try {
      this.room = await this.client.joinOrCreate("my_room", {playerTexture: currentIndex + 1, name: playerName});
      this.backgroundSND=this.sound.add('backgroundSound');
      this.backgroundSND.loop = true;
      this.backgroundSND.play();
      
      createCharacterAnims(this.anims);

      this.map = this.make.tilemap({ key: 'classroom' });
      const tileset = this.map.addTilesetImage('tile_map', 'tiles');
      this.backgroundLayer = this.map.createLayer("background", tileset, 0,0);
      this.groundLayer = this.map.createLayer("ground", tileset, 0,0);
      this.metaDataLayer = this.map.createLayer("metaData", tileset, 0,0);
     
      this.ojbectGroup = this.physics.add.group();
      this.physics.world.enable(this.ojbectGroup); 
      const layerList = [this.backgroundLayer, this.groundLayer, this.metaDataLayer];
      let tileId = 1;
      for(let k = 0; k < layerList.length; k++){
        let layer = layerList[k];
        for(let i = 0; i < 18; i++){
          for(let j = 0; j < 20; j++){
            let tile = layer.getTileAt(i, j);
            if(tile){
              if(tile.index === 3){ // chair
                this.tileEntities[tileId] = new ChairTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } else if(tile.index == 1 || tile.index == 8) { // table
                this.tileEntities[tileId] = new GroundTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } else if(tile.index == 2 || tile.index == 7) { // computer
                this.tileEntities[tileId] = new ComputerTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } else if(19 <= tile.index && tile.index <= 21) { // blackboard
                this.tileEntities[tileId] = new BlackBoardTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } else if( tile.index == 4) { // coffee
                this.tileEntities[tileId] = new CoffeeTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } else if(tile.index == 15) { // wall
                this.tileEntities[tileId] = new GroundTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } 
              // else {
              //   console.log("pass");
              // }
              tileId++;
            }
            
          }
        }
      }
      

      // 맵의 크기를 이미지의 크기로 조절
      this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

     
      this.chatTimer = 0;
      this.eventTimer = 0;

      document.addEventListener('keydown', (event) => {
        this.capsLockOn = event.getModifierState('CapsLock');

      });
      this.addInputListener();
      

      // Handle incoming chat messages from the server
      this.room.onMessage("chat", (messageData) => {
        const { playerId, message, position } = messageData;
        // Check if the player is nearby before displaying the message
        const distance = Phaser.Math.Distance.Between(
          this.currentPlayer.x,
          this.currentPlayer.y,
          position.x,
          position.y
        );
        if (distance < 100) {
          
          const messageContainer = document.getElementById('messageContainer');
          //messageContainer.style.overflowY = 'auto';

          const textMsg = tagManager.createDiv({
            parent: messageContainer,
            text:  `${this.playerEntities[playerId].playerNameText.text}: ${message}`,
            styles: {
              'font-size': '14px',
              'color': Color.gray50,
              'margin-left': '10px',
              'margin-top': '5px',
              'font-weight': 300,
            }
          });
          if(playerId == this.currentPlayer.playerId){
            textMsg.style.textAlign = 'right';
            textMsg.style.color = Color.yellow;
            textMsg.textContent = `${message}`;
          }
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      });

      this.room.onMessage("sit", (messageData) => {
        const { playerId, tileId, setSit, hasPlayer } = messageData;
        const changeTile = this.tileEntities[tileId] as ChairTile;
        changeTile.hasPlayer = hasPlayer;
        if(setSit)
          changeTile.setSit(this.playerEntities[playerId].playerNumber, playerId);
        else if(!setSit)
          changeTile.setStand(this.playerEntities[playerId].playerNumber, playerId);
      });

      this.playerGroup = this.physics.add.group();
      this.physics.world.enable(this.playerGroup);

    
      this.room.state.players.onAdd((player, sessionId) => {
        const entity = new Player(this, player.x, player.y, player.texture, player.name, sessionId, 1);
        entity.setOrigin(0, 0);
        this.playerGroup.add(entity);
        this.playerEntities[sessionId] = entity;
        entity.setCollideWorldBounds(true);
        if (sessionId === this.room.sessionId) {
          this.currentPlayer = entity;
          
          this.physics.add.collider(this.currentPlayer.playerContainer, this.ojbectGroup, (p: any, tile: any) => {
            tile.onCollision(this.currentPlayer);
            this.currentPlayer.isCollision = true;
          });
          this.physics.add.collider(this.currentPlayer, this.ojbectGroup, (p: any, tile: any) => {
            // TODO: seperate to tile id
            
            if(tile.tileType == 2 || tile.tileType == 4 ||tile.tileType == 7 ||
               tile.tileType == 19 || tile.tileType == 20 || tile.tileType == 21 ){
                if(!this.chatOnFocus && !this.shareOnFocus && !this.videoOnFocus){
                  tile.openEvent(this, this.inputPayload.R);
                }
            }
            if(tile.tileType == 3){
              if(!this.chatOnFocus && !this.shareOnFocus && !this.videoOnFocus){
                tile.openEvent(this, this.inputPayload.E);
              }
            }
          });
          this.cameras.main.startFollow(this.currentPlayer);
          this.cameras.main.setSize(MAP_WIDTH, MAP_HEIGHT);
          this.cameras.main.setZoom(2.5);
          this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

          player.onChange(() => {
              entity.setData('serverX', player.x);
              entity.setData('serverY', player.y);
          });
        } else {
            player.onChange(() => {
                entity.setData('serverX', player.x);
                entity.setData('serverY', player.y);
            });
        }
      });
      
    } catch (e) {
      console.error(e);
    }
  }
  

  onLeave(player){
      this.room.state.players.onRemove((player, sessionId) => {
          const entity = this.playerEntities[sessionId];
          if (entity) {
              // destroy entity
              entity.destroy();
      
              // clear local reference
              delete this.playerEntities[sessionId];
          }
      });
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

    this.postUpdate();
  }

  fixedTick(time, timeStep) {
    // skip loop if not connected with room yet.
    if (!this.room) { return; }
    // send input to the server
    const velocity = 2;

    this.inputPayload.left = this.cursor.left.isDown;
    this.inputPayload.right = this.cursor.right.isDown;
    this.inputPayload.up = this.cursor.up.isDown;
    this.inputPayload.down = this.cursor.down.isDown;
    this.inputPayload.E = this.cursor.E.isDown;
    this.inputPayload.A = this.cursor.A.isDown;
    this.inputPayload.S = this.cursor.S.isDown;
    this.inputPayload.D = this.cursor.D.isDown;
    this.inputPayload.W = this.cursor.W.isDown;
    this.inputPayload.R = this.cursor.R.isDown;
    if(this.chatTimer>0)
      this.chatTimer--;
      if(this.eventTimer>0)
      this.eventTimer--;
    let isTap = false;
    this.currentPlayer.previousX = this.currentPlayer.x;
    this.currentPlayer.previousY = this.currentPlayer.y;
    if(!this.currentPlayer.isSit){
      if (this.inputPayload.left || (this.inputPayload.A && (!this.chatOnFocus && !this.shareOnFocus && !this.videoOnFocus))) {
        this.currentPlayer.changeAnims(PlayerState.LEFT);
        this.currentPlayer.x -= velocity;
        isTap = true;
      } else if (this.inputPayload.right || (this.inputPayload.D && (!this.chatOnFocus && !this.shareOnFocus && !this.videoOnFocus))) {
        this.currentPlayer.changeAnims(PlayerState.RIGHT);
          this.currentPlayer.x += velocity;
          isTap = true;
      }
      if (this.inputPayload.up || (this.inputPayload.W && (!this.chatOnFocus && !this.shareOnFocus && !this.videoOnFocus))) {
          this.currentPlayer.changeAnims(PlayerState.UP);
          this.currentPlayer.y -= velocity;
          isTap = true;
      } else if (this.inputPayload.down || (this.inputPayload.S && (!this.chatOnFocus && !this.shareOnFocus && !this.videoOnFocus))) {
          this.currentPlayer.changeAnims(PlayerState.DOWN);
          this.currentPlayer.y += velocity;
          isTap = true;
      }
      if(this.chatInput){
        this.onSpecialKey(this.inputPayload.A, this.chatOnFocus, this.chatInput, 'A', 'a');
        this.onSpecialKey(this.inputPayload.S, this.chatOnFocus, this.chatInput, 'S', 's');
        this.onSpecialKey(this.inputPayload.W, this.chatOnFocus, this.chatInput, 'W', 'w');
        this.onSpecialKey(this.inputPayload.D, this.chatOnFocus, this.chatInput, 'D', 'd');
        this.onSpecialKey(this.inputPayload.E, this.chatOnFocus, this.chatInput, 'E', 'e');
        this.onSpecialKey(this.inputPayload.R, this.chatOnFocus, this.chatInput, 'R', 'r');  
      }
     if(this.videoInput){
        this.onSpecialKey(this.inputPayload.A, this.videoOnFocus, this.videoInput, 'A', 'a');
        this.onSpecialKey(this.inputPayload.S, this.videoOnFocus, this.videoInput, 'S', 's');
        this.onSpecialKey(this.inputPayload.W, this.videoOnFocus, this.videoInput, 'W', 'w');
        this.onSpecialKey(this.inputPayload.D, this.videoOnFocus, this.videoInput, 'D', 'd');
        this.onSpecialKey(this.inputPayload.E, this.videoOnFocus, this.videoInput, 'E', 'e');
        this.onSpecialKey(this.inputPayload.R, this.videoOnFocus, this.videoInput, 'R', 'r');  
      }
      if(this.screenShareInput){
        this.onSpecialKey(this.inputPayload.A, this.shareOnFocus, this.screenShareInput, 'A', 'a');
        this.onSpecialKey(this.inputPayload.S, this.shareOnFocus, this.screenShareInput, 'S', 's');
        this.onSpecialKey(this.inputPayload.W, this.shareOnFocus, this.screenShareInput, 'W', 'w');
        this.onSpecialKey(this.inputPayload.D, this.shareOnFocus, this.screenShareInput, 'D', 'd');
        this.onSpecialKey(this.inputPayload.E, this.shareOnFocus, this.screenShareInput, 'E', 'e');
        this.onSpecialKey(this.inputPayload.R, this.shareOnFocus, this.screenShareInput, 'R', 'r');  
      }
      // if(this.inputPayload.A && this.chatOnFocus && !this.chatTimer){
      //   this.chatInput.value += this.capsLockOn ? 'A' : 'a'; 
      //   this.chatTimer = 5;
      //   this.inputPayload.A = false;
      // } else if(this.inputPayload.S && this.chatOnFocus && !this.chatTimer){
      //   this.chatInput.value += this.capsLockOn ? 'S' : 's';
      //   this.chatTimer = 5;
      //   this.inputPayload.S = false;
      // } else if(this.inputPayload.W && this.chatOnFocus && !this.chatTimer){
      //   this.chatInput.value += this.capsLockOn ? 'W' : 'w';
      //   this.chatTimer = 5;
      //   this.inputPayload.W = false;
      // } else if(this.inputPayload.D && this.chatOnFocus && !this.chatTimer){
      //   this.chatInput.value += this.capsLockOn ? 'D' : 'd';
      //   this.chatTimer = 5;
      //   this.inputPayload.D = false;
      // }
      // else if(this.inputPayload.E && this.chatOnFocus && !this.chatTimer){
      //   this.chatInput.value += this.capsLockOn ? 'E' : 'e';
      //   this.chatTimer = 5;
      //   this.inputPayload.E = false;
      // } else if(this.inputPayload.R && this.chatOnFocus && !this.chatTimer){
      //   this.chatInput.value += this.capsLockOn ? 'R' : 'r';
      //   this.chatTimer = 5;
      //   this.inputPayload.R = false;
      // }
    }
    this.currentPlayer.update();
    if(!isTap)
      this.currentPlayer.changeAnims(PlayerState.IDLE);
    this.room.send("input", {
      "input": this.inputPayload,
      "isCollision": this.currentPlayer.isCollision,
      "position": {x: this.currentPlayer.x, y: this.currentPlayer.y}
    });
    for (let sessionId in this.playerEntities) {
      if (sessionId === this.room.sessionId) {
        const entity = this.playerEntities[sessionId];
        entity.update();
        continue;
      }
      const entity = this.playerEntities[sessionId];
      
      const { serverX, serverY } = entity.data.values;
      const dx = serverX - entity.x;
      const dy = serverY - entity.y;
      entity.update();
      if(dx > 0){
        entity.changeAnims(PlayerState.RIGHT);
      } else if(dx < 0){
        entity.changeAnims(PlayerState.LEFT);
      } else if(dy > 0){
        entity.changeAnims(PlayerState.DOWN);
      } else if(dy < 0){
        entity.changeAnims(PlayerState.UP);
      } else{
        entity.changeAnims(PlayerState.IDLE);
      }
      entity.x = Phaser.Math.Linear(entity.x, serverX, 0.8);
      entity.y = Phaser.Math.Linear(entity.y, serverY, 0.8);
    }
  }

  onSpecialKey(isDown, onFocus, input, upper, lower) {
    if(isDown && onFocus && !this.chatTimer){
      input.value += this.capsLockOn ? upper : lower; 
      this.chatTimer = 5;
      isDown = false;
    }
  }

  addInputListener(){
      this.chatInput = document.getElementById('chatInput');
      this.screenShareInput = document.getElementById('screenShareInput');
      this.videoInput = document.getElementById('videoInput');
      if(this.chatInput){
        this.chatInput.addEventListener('blur', () => {
          this.chatOnFocus = false;
        });
        this.chatInput.addEventListener('focus', () => {
          this.chatOnFocus = true;
        });
      }
      if(this.screenShareInput) {
        this.screenShareInput.addEventListener('blur', () => {
          this.shareOnFocus = false;
        });
        this.screenShareInput.addEventListener('focus', () => {
          this.shareOnFocus = true;
        });
      }
      if(this.videoInput){
        this.videoInput.addEventListener('blur', () => {
          this.videoOnFocus = false;
        });
        this.videoInput.addEventListener('focus', () => {
          this.videoOnFocus = true;
        });
      }
  }

  postUpdate() {
    this.currentPlayer.isCollision = false;
  }
}