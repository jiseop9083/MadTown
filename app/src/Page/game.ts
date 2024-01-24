import { Scene } from "phaser";
import { Client, Room } from "colyseus.js";
import { Keyboard, Keys } from "../types/KeyboardState";

import { createCharacterAnims } from "../anims/CharacterAnims";
import { Player } from "../Objects/Player";
import { PlayerState } from "../types/PlayerState";
import { TagManager } from "../util/TagManager";
import Color from "../types/Color";
import { GroundTile, ChairTile, BlackBoardTile, Tile } from "../Objects/Tiles";


const dotenv = require('dotenv');
dotenv.config();

const HTTP_SERVER_URI = process.env.MOCK_HTTP_SERVER_URI;
const SERVER_URI = process.env.MOCK_SERVER_URI;
const tagManager = TagManager.getInstance();

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 600;

declare var currentIndex: number;
declare var playerName: string;

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
      ...(this.input.keyboard.addKeys('W,S,A,D,E') as Keyboard),
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

  cursor: Keys;
  chatText: Phaser.GameObjects.Text;
  
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
  };

  async create() {
    console.log("Joining room...");

    var backgroundSND=this.sound.add('backgroundSound');
    backgroundSND.loop = true;
    backgroundSND.play();

    try {
      this.room = await this.client.joinOrCreate("my_room", {playerTexture: currentIndex + 1, name: playerName});
      console.log(playerName);

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
                this.tileEntities[tileId] = new GroundTile(this, i, j, 'tile_set', tile.index, tileId);
                this.ojbectGroup.add(this.tileEntities[tileId]);
              } else if(19 <= tile.index && tile.index <= 21) { // blackboard
                this.tileEntities[tileId] = new BlackBoardTile(this, i, j, 'tile_set', tile.index, tileId);
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
      
      
      
      this.chatText = this.add.text(0, 0, '', {
        fontSize: '16px',
        color: '#ffffff',
      });

      // 맵의 크기를 이미지의 크기로 조절
      this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

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

          tagManager.createDiv({
            parent: messageContainer,
            text:  `Player ${playerId}: ${message}`,
            styles: {
              'font-size': '14px',
              'color': Color.gray50,
              'margin-left': '10px',
              'margin-top': '5px',
              'font-weight': 300,
            }
          });

          this.chatText.setText(this.chatText.text +  `Player ${playerId}: ${message}\n`);
          // Scroll to the bottom if there is a scroll
          this.chatText.setScrollFactor(0, 0);

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

        console.log(player.name);

        
        
        if (sessionId === this.room.sessionId) {
          this.currentPlayer = entity;
          
          this.physics.add.collider(this.currentPlayer.playerContainer, this.ojbectGroup, (p: any, tile: any) => {
            tile.onCollision(this.currentPlayer);
            this.currentPlayer.isCollision = true;
          });
          this.physics.add.collider(this.currentPlayer, this.ojbectGroup, (p: any, tile: any) => {
            // TODO: seperate to tile id
            tile.openEvent(this, this.inputPayload.E);
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

    this.postUpdate()
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
    let isTap = false;
    this.currentPlayer.previousX = this.currentPlayer.x;
    this.currentPlayer.previousY = this.currentPlayer.y;
    if(!this.currentPlayer.isSit){
      if (this.inputPayload.left) {
        this.currentPlayer.changeAnims(PlayerState.LEFT);
        this.currentPlayer.x -= velocity;
        isTap = true;
      } else if (this.inputPayload.right) {
        this.currentPlayer.changeAnims(PlayerState.RIGHT);
          this.currentPlayer.x += velocity;
          isTap = true;
      }
      if (this.inputPayload.up) {
          this.currentPlayer.changeAnims(PlayerState.UP);
          this.currentPlayer.y -= velocity;
          isTap = true;
      } else if (this.inputPayload.down) {
          this.currentPlayer.changeAnims(PlayerState.DOWN);
          this.currentPlayer.y += velocity;
          isTap = true;
      }
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

  postUpdate() {
    this.currentPlayer.isCollision = false;
  }
}