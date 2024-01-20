import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";
import { ChatHandler } from "./ChatHandler";

export class MyRoom extends Room<MyRoomState> {
  private chatHandler: ChatHandler;

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
      player.inputQueue.push(data.input);
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
        let input: any;

        // dequeue player inputs
        while (input = player.inputQueue.shift()) {
            if (input.left) {
                player.x -= velocity;

            } else if (input.right) {
                player.x += velocity;
            }

            if (input.up) {
                player.y -= velocity;

            } else if (input.down) {
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

    // place Player at a random position
    player.x = (Math.random() * mapWidth);
    player.y = (Math.random() * mapHeight);

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
