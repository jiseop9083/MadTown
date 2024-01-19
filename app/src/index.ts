import {Scene} from "phaser";
import { Client, Room } from "colyseus.js";
const dotenv = require('dotenv');
dotenv.config();

// custom scene class
export class GameScene extends Scene {
  preload() {
    // preload scene
    this.load.image('santa', `${process.env.MOCK_HTTP_SERVER_URI}/assets/mountainUp.png`);
    this.load.image('ship_0001', 'https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png');
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  client = new Client(`${process.env.MOCK_SERVER_URI}`);

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

  async create() {
    console.log("Joining room...");

    try {
      this.room = await this.client.joinOrCreate("my_room");
      this.room.state.players.onAdd((player, sessionId) => {
      const entity = this.physics.add.image(player.x, player.y, 'santa');
      console.log(entity);
      entity.setScale(1);

      // const map = this.make.tilemap({key : "map", tileWidth: 32, tileHeight: 32});
      // const tileset = map.addTilesetImage("tiles1", "tiles");
      // const layer = map.createLayer("ground", tileset, 0, 0);
      // const cactsLayer = map.createLayer('cactus1', tileset, 0,0);
    
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
    this.room.send(0, {
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
    width: 800,
    height: 600,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// instantiate the game
const game = new Phaser.Game(config);