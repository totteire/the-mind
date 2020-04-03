import { Room, Client } from "colyseus";
import {Schema, type, MapSchema, ArraySchema} from "@colyseus/schema";
import * as request from 'request-promise';

const config = {
    LEVEL_MAX: 8,
};


export class Player extends Schema {
    @type("string")
    name = '';
    @type(["number"])
    cards = new ArraySchema<number>();
}
const constants = { SHURIKEN: 'SHURIKEN', LIFE: 'LIFE' };
export class Game extends Schema {
    @type("number")
    level = 4;
    @type("number")
    lifes = 4;
    @type("number")
    shurikens = 1;
    @type("boolean")
    isStarted = false;

    config = {
        bonus: {
            2: constants.SHURIKEN,
            3: constants.LIFE,
            5: constants.SHURIKEN,
            6: constants.LIFE,
            8: constants.SHURIKEN,
            9: constants.LIFE,
        }
    };

    levelUp () {
        this.level ++;
        if (this.config.bonus[this.level]) {
            if (this.config.bonus[this.level] === constants.LIFE) {
                this.lifes ++;
            }
            if (this.config.bonus[this.level] === constants.SHURIKEN) {
                this.shurikens ++;
            }
        }
    }
    looseLife () {
        this.lifes --;
        if (this.lifes === 0) {
            this.isStarted = false;
        }
    }
}

let nobodyPlays = false;
export class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();
    @type(Game)
    game = new Game();
    @type(["number"])
    deck = new ArraySchema<number>();
    room: Room;

    constructor(room: Room) {
        super();
        this.room = room;
    }

    createPlayer (id: string) {
        this.players[ id ] = new Player();
    }

    removePlayer (id: string) {
        delete this.players[ id ];
    }

    startGame () {
        this.game.isStarted = true;
        this.game.level = 1;
        this.dealCards();
    }

    dealCards () {
        const dealtCards = [];
        for (let i = 0; i < this.game.level; i++) {
            Object.keys(this.players).forEach((sessionId) => {
                let newCard;
                do {
                    newCard = Math.ceil(Math.random()*100);
                } while (dealtCards.indexOf(newCard) >= 0);
                dealtCards.push(newCard);
                this.players[sessionId].cards.push(newCard);
            });
        }
        // sort hands
        Object.keys(this.players).forEach((sessionId) => {
            const player = this.players[sessionId];
            player.cards.sort((a, b) => a - b);
        });
        console.log('cards dealt: ', dealtCards);
    }

    playCard (sessionId: string, card: number) {
        const player = this.players[sessionId];
        // remove card from player's hand
        player.cards = player.cards.filter(c => c !== card);
        // place card on deck
        this.deck.push(card);
        console.log('deck: ', this.deck);
        // check if no lower card
        const remainingCards = Object.keys(this.players).reduce((acc, key) => [...acc, ...this.players[key].cards.map(c => ({ value: c, owner: this.players[key] }))], []);
        // [{ owner, value }, ...]
        if (remainingCards.find(c => c.value < card)) {
            const lowestCardValue = remainingCards.reduce((prev, cardObj) => ({ value: Math.min(prev.value, cardObj.value) }), { value: card }).value;
            const lowestCardObj = remainingCards.find(cObj => cObj.value === lowestCardValue);
            const lowestCardObjFlat = { ...lowestCardObj, ownerName: lowestCardObj.owner.name };
            return this.makeMistake(player, card, lowestCardObjFlat);
        }
        // check if level ends
        if (!remainingCards.length) {
            this.levelUp();
        }
    }

    async levelUp () {
        this.game.levelUp();
        if (this.game.level === config.LEVEL_MAX) {
            const gif = await Giphy.getRandomGif('victory');
            this.room.broadcast({ action: 'WIN', gif });
            return this.endGame();
        }
        this.room.broadcast({ action: 'LEVEL_UP' });
        this.dealCards();
        this.deck = new ArraySchema<number>();
    }

    async makeMistake (player, card, lowestCardObj) {
        this.game.looseLife();
        if (this.game.lifes === 0) {
            const gif = await Giphy.getRandomGif('fail');
            this.room.broadcast({ action: 'LOOSE', gif });
            return this.endGame();
        } else {
            // const gif = await Giphy.getRandomGif('oups');
            this.room.broadcast({ action: 'MISTAKE', player, card, lowestCardObj });
        }

        // lock game
        nobodyPlays = true;
        // after 5 seconds give card back
        setTimeout((() => {
            nobodyPlays = false;
            this.deck = this.deck.filter(c => c !== card);
            player.cards.push(card);
        }).bind(this), 3000)

    }

    endGame () {
        this.game = new Game();
        // empty hands
        Object.keys(this.players).forEach(key => this.players[key].cards = new ArraySchema<number>());
        this.deck = new ArraySchema<number>();
    }
}

export class TheMind extends Room<State> {
    maxClients = 4;
    frozen = false;

    onCreate (options) {
        console.log("StateHandlerRoom created!", options);
        this.setState(new State(this));
    }

    onJoin (client: Client) {
        this.send(client, { hello: "world!" });
        this.state.createPlayer(client.sessionId);
        if (this.state.game.isStarted) {
            this.send(client, { action: 'GAME_IN_PROGRESS' });
        }
    }

    async onLeave (client) {
        // try {
        //     await this.allowReconnection(client, 15);
        // } catch(e) {
        this.state.removePlayer(client.sessionId);
        // }
    }

    onMessage (client, data) {
        console.log(data);
        if (data.name) {
            this.state.players[client.sessionId].name = data.name;
        }
        if (data.action && data.action === 'START_GAME') {
            this.state.startGame();
        }
        if (data.action && data.action === 'PLAY_CARD' && !nobodyPlays) {
            this.state.playCard(client.sessionId, data.card);
        }
        if (data.action && data.action === 'RESTART') {
            this.state.endGame();
        }
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}

class Giphy {
    static API_KEY = 'UtNOErTJUT3pMz69N8LJHB801hDkX8nM';
    static randomGifUrl = 'https://api.giphy.com/v1/gifs/random';

    static async getRandomGif (tag) {
        const reqOpt = {
            uri: this.randomGifUrl,
            qs: {
                api_key: this.API_KEY,
                tag,
                random_id: new Date().getTime(),
            },
        };
        try {
            const res = await request.get(reqOpt);
            const data = JSON.parse(res).data;
            return data && data.embed_url;
        } catch (e) {
            console.error(e);
            return false;
        }

    }
}
