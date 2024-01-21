import { MyRoom } from "./MyRoom";

export class ChatHandler {
  private room: MyRoom;

  constructor(room: MyRoom) {
    this.room = room;
  }

  handleChatMessage(client: any, data: any) {
    const player = this.room.state.players.get(client.sessionId);

    this.room.broadcast("chat", {
      playerId: client.sessionId,
      message: data.chat.message,
      position: { x: player.x, y: player.y }
    });
  }

  handlePlayerInput(client: any, data: any) {
    const player = this.room.state.players.get(client.sessionId);

    if (player) {
      player.inputQueue.push(data.input);
    }
  }
}
