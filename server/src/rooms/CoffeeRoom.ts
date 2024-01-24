import { Room, Client } from "@colyseus/core";
import { CoffeeRoomState , GamblePlayer} from "./schema/CoffeeRoomState";


export class CoffeeRoom extends Room<CoffeeRoomState> {
 
  maxClients = 8;
  clientNumber = 0;
  fixedTimeStep = 1000 / 60;
  playerPos = [
    {x:4, y: 6 },
    {x:6, y: 2 },
    {x:2, y: 0 },
    {x:0, y: 4 },
    {x:2, y: 6 },
    {x:6, y: 4 },
    {x:4, y: 0 },
    {x:0, y: 2 }
]

  constructor(options: any) {
    super(options);
  }
  
  onCreate(options: any) {
    this.setState(new CoffeeRoomState());

    
    this.onMessage("gameStart", (client, data) => {
        
        this.broadcast("gameStart", {
            playerId: client.sessionId,
            gameTimer: data.gameStart,
          });
    });  

    this.onMessage("setState", (client, data) => {
        this.broadcast("setState", {
            playerId: client.sessionId,
            state: data.state,
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
    this.state.gamblePlayers.forEach(gamblePlayer => {
        let inputData: any;

        // dequeue player inputs
        while (inputData = gamblePlayer.inputQueue.shift()) {
           
        }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    // create Player instance
    const gamblePlayer = new GamblePlayer();
    gamblePlayer.number = this.clientNumber;
    gamblePlayer.state = 0;
    gamblePlayer.x = (this.playerPos[this.clientNumber].x + 2) * 32 + 16;
    gamblePlayer.y = this.playerPos[this.clientNumber].y * 32 + 16;
    this.state.gamblePlayers.set(client.sessionId, gamblePlayer);

    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.gamblePlayers.set(client.sessionId, gamblePlayer);

    this.clientNumber++;
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.clientNumber--;
    this.state.gamblePlayers.delete(client.sessionId); 
     
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
