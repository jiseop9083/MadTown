import { MapSchema, Schema, type } from "@colyseus/schema";

export class GamblePlayer extends Schema {
    @type("number") number: number;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") state: number; // 1: 가위, 2: 바위, 3: 보

    // use to determinism
    inputQueue: any[] = [];
}

export class CoffeeRoomState extends Schema {
    @type({ map: GamblePlayer }) gamblePlayers = new MapSchema<GamblePlayer>();
}