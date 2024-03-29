import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";
import { ChatHandler } from "./ChatHandler";


export class MyRoom extends Room<MyRoomState> {
  private chatHandler: ChatHandler;

  // TODO: move to DB
  // roomName, creatorID
  rooms : Map<string, string> = new Map();
  maxClients = 4;
  fixedTimeStep = 1000 / 60;

  constructor(options: any) {
    super(options);
    this.chatHandler = new ChatHandler(this);
  }
  
  onCreate(options: any) {
    this.setState(new MyRoomState());

    this.onMessage("chat", (client, data) => this.chatHandler.handleChatMessage(client, data));

    this.onMessage("input", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.inputQueue.push({input: data.input, isCollision: data.isCollision, position: data.position});
    });  

    this.onMessage("sit", (client, data) => {
      this.broadcast("sit", {
        playerId: client.sessionId,
        tileId: data.tileId,
        setSit: data.setSit,
        hasPlayer: data.hasPlayer,
      });
    });


    this.onMessage("join_room", (client, data) => {
      
      this.broadcast("join_room", {
        playerId: client.sessionId,
        roomName: data.roomName
      });
    });

    this.onMessage("join_room_screen", (client, data) => {
      
      this.broadcast("join_room_screen", {
        playerId: client.sessionId,
        roomName: data.roomName
      });
    });

    this.onMessage("offer", (client, data) => {
      
      // DOTO: send message to clients in the room
      this.broadcast("offer", {
        playerId: client.sessionId,
        roomName: data.roomName,
        offer: data.offer,
      });
    });  

    this.onMessage("answer", (client, data) => {
      // DOTO: send message to clients in the room
      this.broadcast("answer", {
        playerId: client.sessionId,
        roomName: data.roomName,
        answer: data.answer,
      });
    });  

    this.onMessage("ice", (client, data) => {
      this.broadcast("ice", {
        playerId: client.sessionId,
        roomName: data.roomName,
        ice: data.ice,
      });
    });  

    this.onMessage("blackboard", (client, data) => {
      this.broadcast("blackboard", {
        playerId: client.sessionId,
        doodle: data.doodle,
      });
    });
    
    this.onMessage("offer_screen", (client, data) => {
      console.log("offer screen : ", data);
      this.broadcast("offer_screen", {
        playerId: client.sessionId,
        roomName: data.roomName,
        offer: data.offer,
      });
    });
    
    this.onMessage("answer_screen", (client, data) => {
      this.broadcast("answer_screen", {
        playerId: client.sessionId,
        roomName: data.roomName,
        answer: data.answer,
      });
    });
    
    this.onMessage("screen_ice", (client, data) => {
      this.broadcast("screen_ice", {
        playerId: client.sessionId,
        roomName: data.roomName,
        candidate: data.candidate,
      });
    });

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
          elapsedTime -= this.fixedTimeStep;
          this.fixedTick(this.fixedTimeStep);
      }
    });

  }

  fixedUpdate(deltaTime: number) {
    this.fixedTick(deltaTime);
  }

  fixedTick(deltaTime: number){
    const velocity = 2;
    this.state.players.forEach(player => {
        let inputData: any;

        // dequeue player inputs
        while (inputData = player.inputQueue.shift()) {
            if(inputData.isCollision){
              player.x = inputData.position.x;
              player.y = inputData.position.y;
            }
            if (inputData.input.left) {
                player.x -= velocity;

            } else if (inputData.input.right) {
                player.x += velocity;
            }

            if (inputData.input.up) {
                player.y -= velocity;

            } else if (inputData.input.down) {
                player.y += velocity;
            }
        }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const mapWidth = 576;
    const mapHeight = 640;

    // create Player instance
    const player = new Player();


    player.x = 112;
    player.y = 592;
    player.texture = options.playerTexture;
    player.name = options.name;

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);

    

    
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId); 
     
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
