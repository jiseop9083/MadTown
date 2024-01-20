import { Scene } from "phaser";
import { Client, Room } from "colyseus.js";
const dotenv = require('dotenv');
dotenv.config();

const HTTP_SERVER_URI = process.env.MOCK_HTTP_SERVER_URI;
const SERVER_URI = process.env.MOCK_SERVER_URI;

// custom scene class
export class GameScene extends Scene {
  preload() {
    // preload scene
    this.load.image('santa', `${HTTP_SERVER_URI}/image/player-mountainUp.png`);
    this.load.image('tiles', `${HTTP_SERVER_URI}/image/tiles-tile_map.png`);
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

  currentPlayer: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  remoteRef: Phaser.GameObjects.Rectangle;

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  chatText: Phaser.GameObjects.Text;

  videoButton: Phaser.GameObjects.Text;

  async create() {
    console.log("Joining room...");

    try {
      this.room = await this.client.joinOrCreate("my_room");

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
        this.startVideoConference();
      });

      console.log("video button created");

      // 맵의 크기를 이미지의 크기로 조절
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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
        const entity = this.physics.add.image(player.x, player.y, 'santa');
        entity.setScale(1);
    
        // keep a reference of it on `playerEntities`
        this.playerEntities[sessionId] = entity;

        if (sessionId === this.room.sessionId) {
          // this is the current player!
          // (we are going to treat it differently during the update loop)
          this.currentPlayer = entity;

          // remoteRef is being used for debug only
          this.remoteRef = this.add.rectangle(0, 0, entity.width, entity.height);
          this.remoteRef.setStrokeStyle(1, 0xff0000);

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
        // Alternative, listening to individual properties:
        //player.listen("x", (newX, prevX) => console.log(newX, prevX));
        //player.listen("y", (newY, prevY) => console.log(newY, prevY));

    });

    } catch (e) {
      console.error(e);
    }
  }

  startVideoConference() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // 비디오 요소를 생성하고 스트림을 연결
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.autoplay = true;

        document.body.appendChild(videoElement);

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const videoWidth = 200;
        const videoHeight = 150;

        videoElement.style.position = 'absolute';
        videoElement.style.left = `${centerX - videoWidth / 2}px`;
        videoElement.style.top = `${centerY - videoHeight}px`;
        videoElement.style.width = `${videoWidth}px`;
        videoElement.style.height = `${videoHeight}px`;
    })
    .catch((error) => {
      console.error('Error accessing webcam and/or microphone:', error);
    })
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

    if (this.inputPayload.left) {
      this.currentPlayer.x -= velocity;
    } else if (this.inputPayload.right) {
        this.currentPlayer.x += velocity;
    }
    if (this.inputPayload.up) {
        this.currentPlayer.y -= velocity;
    } else if (this.inputPayload.down) {
        this.currentPlayer.y += velocity;
    }

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