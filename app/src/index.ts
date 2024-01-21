import { Scene } from "phaser";
import { Client, Room } from "colyseus.js";

import { createCharacterAnims } from "./anims/CharacterAnims";
import { Player } from "./characters/Player";
import { PlayerState } from "./types/PlayerState";
import { startVideoConference } from "./video/WebRTC";
const dotenv = require('dotenv');
dotenv.config();

const HTTP_SERVER_URI = process.env.MOCK_HTTP_SERVER_URI;
const SERVER_URI = process.env.MOCK_SERVER_URI;


// custom scene class
export class GameScene extends Scene {
  preload() {
    // DOTO: merge spritesheet with similar thing to reduce loading time
    // EX) idle + moveRight + moveLeft + and so on...
    this.load.image('santa', `${HTTP_SERVER_URI}/image/player-mountainUp.png`);
    //this.load.image('avatar1', `${HTTP_SERVER_URI}/image/player-character1_idle.png`);
    this.load.image('tiles', `${HTTP_SERVER_URI}/image/tiles-tile_map.png`);
    this.load.spritesheet('avatar_idle', `${HTTP_SERVER_URI}/image/player-character1_idle.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar_front', `${HTTP_SERVER_URI}/image/player-character1_front.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar_back', `${HTTP_SERVER_URI}/image/player-character1_back.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar_right', `${HTTP_SERVER_URI}/image/player-character1_right.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('avatar_left', `${HTTP_SERVER_URI}/image/player-character1_left.png`, { frameWidth: 32, frameHeight: 32 });
    this.load.tilemapTiledJSON('classroom', `${HTTP_SERVER_URI}/json/tiles-classroom.json`);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    
  }

  client = new Client(`${SERVER_URI}`);

  // process.env.SERVER_URI
  room: Room;

  playerEntities: {[sessionId: string]: any} = {};

  inputPayload = {
      left: false,
      right: false,
      up: false,
      down: false,
  };

  currentPlayer: Player;
  remoteRef: Phaser.GameObjects.Rectangle;

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  chatText: Phaser.GameObjects.Text;

  videoButton: Phaser.GameObjects.Text;

  

  async create() {
    console.log("Joining room...");

    try {
      this.room = await this.client.joinOrCreate("my_room");

      createCharacterAnims(this.anims);

      this.input.keyboard.on('keydown-ENTER', () => {
        const message = prompt("Enter your message:");
        if (message) {
          // Send chat message to the server with the player's position
          this.room.send("chat", {"chat": {
            message,
            position: { x: this.currentPlayer.x, y: this.currentPlayer.y }
          }});
        }
      });

      

      const map = this.make.tilemap({ key: 'classroom' });

      const tileset = map.addTilesetImage('tile_map', 'tiles');
      const backgroundLayer = map.createLayer("background", tileset, 0,0);
      const groundLayer = map.createLayer("ground", tileset, 0,0);
     
      // groundLayer.setCollisionBetween(0, 4);

      this.chatText = this.add.text(0, 0, '', {
        fontSize: '16px',
        color: '#ffffff',
      });

      this.videoButton = this.add.text(10, 80, 'Start Video', {
        fontSize: '16px',
        color: '#000000',
        backgroundColor: '#3498db',
        padding: { x: 10, y: 5 },
      });

      this.videoButton.setInteractive();
      this.videoButton.on('pointerdown', () => {
        startVideoConference(this, this.currentPlayer);
        console.log(this.currentPlayer.playerId);
      });


      // 맵의 크기를 이미지의 크기로 조절
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      
      

      // video
      


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
          this.chatText.setText(this.chatText.text +  `Player ${playerId}: ${message}\n`);
          // Scroll to the bottom if there is a scroll
          this.chatText.setScrollFactor(0, 0);
        }
      });

      


      this.room.state.players.onAdd((player, sessionId) => {
        const entity = new Player(this, player.x, player.y, 'avatar', sessionId, 1);
        // this.physics.add.collider(player, groundLayer, () => {console.log("hello")});
        // groundLayer.map(object => {
        //   // 각 객체에 대해 충돌 체크를 위한 물리 바디를 추가
        //   console.log(object.x, object.y);
        // });
        // this.physics.add.collider(entity.playerContainer, groundLayer);
        
        // keep a reference of it on `playerEntities`

        if (sessionId === this.room.sessionId) {
          this.currentPlayer = entity;

          // this is being used for debug only
          entity.debugMode(true);

          player.onChange(() => {
              this.remoteRef.x = player.x;
              this.remoteRef.y = player.y;
              entity.setData('serverX', player.x);
              entity.setData('serverY', player.y);
          });
        } else {
            // all remote players are here!
            // (same as before, we are going to interpolate remote players)
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
  }

  fixedTick(time, timeStep) {
    //
    // paste the previous `update()` implementation here!
    // skip loop if not connected with room yet.
    if (!this.room) { return; }
    // send input to the server
    const velocity = 2;
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    let isTap = false;
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
    if(!isTap)
      this.currentPlayer.changeAnims(PlayerState.IDLE);
    // type, data
    // TODO: 0 -> input
    this.room.send("input", {
      "input": this.inputPayload
    });

    for (let sessionId in this.playerEntities) {
      // do not interpolate the current player
      if (sessionId === this.room.sessionId) {
        continue;
    }

      // interpolate all player entities
      const entity = this.playerEntities[sessionId];
      const { serverX, serverY } = entity.data.values;

      entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
    }
    //
  }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 576,
    height: 640,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// instantiate the game
const game = new Phaser.Game(config);