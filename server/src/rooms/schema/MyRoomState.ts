import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
    @type("number") texture: number;
    @type("string") name: string;

    // use to determinism
    inputQueue: any[] = [];
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}