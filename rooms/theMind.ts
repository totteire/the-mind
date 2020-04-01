import { Room, Client } from "colyseus";
import {Schema, type, MapSchema, ArraySchema} from "@colyseus/schema";

export class Player extends Schema {
    @type("string")
    name = '';
    @type(["number"])
    cards = new ArraySchema<number>();
}
export class Game extends Schema {
    @type("number")
    level = 0;
}

export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
    @type(Game)
    game = new Game();

    something = "This attribute won't be sent to the client-side";

    createPlayer (id: string) {
        this.players[ id ] = new Player();
    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    startGame () {
        this.game.level = 1;
        this.dealCards();
    }

    dealCards () {
        for (let i = 0; i < this.game.level; i++) {
            Object.keys(this.players).forEach((sessionId) => {
                const newCard = Math.ceil(Math.random()*100);
                this.players[sessionId].cards.push(newCard);
            });
        }
    }
}

export class TheMind extends Room<State> {
    maxClients = 4;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.setState(new State());
    }

    onJoin (client: Client) {
        this.send(client, { hello: "world!" });
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log(data);
        if (data.name) {
            this.state.players[client.sessionId].name = data.name;
        }
        if (data.action && data.action === 'START_GAME') {
            this.state.startGame();
        }
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}
