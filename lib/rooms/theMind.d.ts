import { Room, Client } from "colyseus";
import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
export declare class Player extends Schema {
    name: string;
    cards: ArraySchema<number>;
    shurikenActive: boolean;
    shurikenCard: number;
}
export declare class Game extends Schema {
    level: number;
    lifes: number;
    shurikens: number;
    isStarted: boolean;
    config: {
        bonus: {
            2: string;
            3: string;
            5: string;
            6: string;
            8: string;
            9: string;
        };
    };
    levelUp(): void;
    looseLife(): void;
}
export declare class State extends Schema {
    players: MapSchema<Player>;
    game: Game;
    deck: ArraySchema<number>;
    room: Room;
    constructor(room: Room);
    createPlayer(sessionId: string): void;
    removePlayer(sessionId: string): void;
    startGame(): void;
    dealCards(): void;
    playCard(sessionId: string, card: number): Promise<void>;
    levelUp(): Promise<void>;
    makeMistake(player: any, card: any, lowestCardObj: any): Promise<void>;
    activateShuriken(sessionId: string): Promise<void>;
    playShuriken(): void;
    endGame(): void;
}
export declare class TheMind extends Room<State> {
    maxClients: number;
    frozen: boolean;
    onCreate(options: any): void;
    onJoin(client: Client): void;
    onLeave(client: any): Promise<void>;
    onMessage(client: any, data: any): void;
    onDispose(): void;
}
