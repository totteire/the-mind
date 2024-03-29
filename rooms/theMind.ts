import { Room, Client } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import * as request from 'request-promise';

const wait = (time) => new Promise(res => setTimeout(res, time));

const config = {
  LEVEL_MAX: 8,
  WITHDRAW_SHURIKEN_TIME: 15000,
};


export class Player extends Schema {
  @type("string")
  name = '';
  @type(["number"])
  cards = new ArraySchema<number>();
  @type("boolean")
  shurikenActive = false;
  @type("number")
  shurikenCard = 0;
}

const constants = { SHURIKEN: 'SHURIKEN', LIFE: 'LIFE' };

export class Game extends Schema {
  @type("number")
  level = 0;
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

  levelUp() {
    this.level++;
    if (this.config.bonus[this.level]) {
      if (this.config.bonus[this.level] === constants.LIFE) {
        this.lifes++;
      }
      if (this.config.bonus[this.level] === constants.SHURIKEN) {
        this.shurikens++;
      }
    }
  }

  looseLife() {
    this.lifes--;
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

  createPlayer(sessionId: string) {
    console.log('creating new player');
    this.players[sessionId] = new Player();
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  startGame() {
    this.game.isStarted = true;
    this.game.level = 1;
    this.dealCards();
  }

  dealCards() {
    const dealtCards = [];
    for (let i = 0; i < this.game.level; i++) {
      this.players.forEach((player) => {
        let newCard;
        do {
          newCard = Math.ceil(Math.random() * 100);
        } while (dealtCards.indexOf(newCard) >= 0);
        dealtCards.push(newCard);
        player.cards.push(newCard);
      });
    }
    // sort hands
    this.players.forEach((player) => {
      player.cards.sort((a, b) => a - b);
    });
    this.players.triggerAll();
    console.log('cards dealt: ', dealtCards);
  }

  playCard(sessionId: string, card: number) {
    const player = this.players[sessionId];
    // remove card from player's hand
    const cardIndex = player.cards.findIndex(c => c === card);
    player.cards.splice(cardIndex, 1);
    // place card on deck
    this.deck.push(card);
    console.log('deck: ', this.deck);
    // check if no lower card
    let remainingCards = [];
    this.players.forEach((player) => {
      if (player.cards.length > 0) {
        remainingCards = [...remainingCards, { owner: player, value: player.cards[0] }];
      }
    });
    // [{ owner, value }, ...]
    if (remainingCards.find(c => c.value < card)) {
      const lowestCardValue = remainingCards.reduce((prev, cardObj) => ({ value: Math.min(prev.value, cardObj.value) }), { value: card }).value;
      const lowestCardObj = remainingCards.find(cObj => cObj.value === lowestCardValue);
      const lowestCardObjFlat = { ...lowestCardObj, ownerName: lowestCardObj.owner.name };
      return this.makeMistake(player, card, lowestCardObjFlat);
    }
    // reset of shurikenCard value
    this.players.forEach((player) => {
      if (card > player.shurikenCard) {
        player.shurikenCard = 0;
      }
    })
    // check if level ends
    if (!remainingCards.length) {
      return this.levelUp();
    }
  }

  async levelUp() {
    this.game.levelUp();
    if (this.game.level === config.LEVEL_MAX) {
      // const gif = await Giphy.getRandomGif('victory');
      this.room.broadcast('WIN');
      await wait(2000);
      return this.endGame();
    }
    this.room.broadcast('LEVEL_UP');
    await wait(2000);
    this.dealCards();
    this.deck.splice(0, this.deck.length);
  }

  async makeMistake(player, card, lowestCardObj) {
    console.log('Make mistake', card, lowestCardObj)
    this.game.looseLife();
    if (this.game.lifes === 0) {
      // const gif = await Giphy.getRandomGif('fail');
      this.room.broadcast('LOOSE');
      await wait(2000);
      return this.endGame();
    } else {
      // lock game
      console.log('lock');
      nobodyPlays = true;

      // const gif = await Giphy.getRandomGif('oups');
      this.room.broadcast('MISTAKE', { player, card, lowestCardObj });
    }

    await wait(3000);
    console.log('unlock');
    nobodyPlays = false;
    this.deck = this.deck.filter(c => c !== card);
    player.cards.push(card);
    player.cards.sort((a, b) => a - b);
  }

  async activateShuriken(sessionId: string) {
    const player = this.players[sessionId];
    // check if remaining shuriken is > O
    if (this.game.shurikens > 0) {
      // active le shuriken du joueur
      if (player.shurikenActive === false) {
        player.shurikenActive = true;
      }
      // + regarde si tous les joueurs ont activé le shuriken (sauf ceux qui n'ont plus de cartes)
      const players = Object.values(this.players);
      const playerNotReady = players.find(p => p.cards?.length && !p.shurikenActive);
      // joue le shuriken
      if (!playerNotReady) {
        this.playShuriken(); // appelle la fonction playShuriken
        player.shurikenActive = false;
      } else {
        // + Lance untimer pour de 10sec
        await wait(config.WITHDRAW_SHURIKEN_TIME);
        // désactive le shuriken du player
        player.shurikenActive = false;
        console.log(player.name, player.shurikenActive);
      }
    }
  }

  async playShuriken() {
    console.log("Shuriken Played !");
    // décrémente le nombre de shuriken disponible
    this.game.shurikens--;
    // initialise le nombre de carte restant.
    let cardNumber = 0;
    await wait(2000); // tempo pour intégrer une animation
    for (const sessionId in this.players) {
      if (this.players[sessionId].cards.length > 0) {
        // ajout de cette carte dans shurikenCard du player
        this.players[sessionId].shurikenCard = this.players[sessionId].cards[0];
        // supprime la plus petite carte de chaque joueur (s'il reste des cartes)
        this.players[sessionId].cards.splice(0, 1);
        // ajoute le nombre de carte restante au nombre total de cartes
        cardNumber = cardNumber + this.players[sessionId].cards.length;
      }
    }
    // si plus de cartes en jeu => levelup
    if (cardNumber === 0) {
      this.levelUp();
    }
  }

  endGame() {
    this.game = new Game();
    // empty hands
    this.players.forEach((player) => player.cards.splice(0, player.cards.length));
    this.deck.splice(0, this.deck.length)
    nobodyPlays = false;
  }
}

export class TheMind extends Room<State> {
  maxClients = 6;
  frozen = false;

  onCreate(options) {
    console.log("StateHandlerRoom created!", options);
    this.setState(new State(this));
    this.setMetadata(options);

    this.onMessage('SET_NAME', (client, { name }) => {
      this.state.players.get(client.sessionId).name = name;
    });
    this.onMessage('START_GAME', () => {
      this.state.startGame();
    });
    this.onMessage('PLAY_CARD', (client, { card }) => {
      if (!nobodyPlays) {
        this.state.playCard(client.sessionId, card);
      }
    });
    this.onMessage('RESTART', () => {
      this.state.endGame();
    });
    this.onMessage('SHURIKEN', (client) => {
      this.state.activateShuriken(client.sessionId);
    });
  }

  onJoin(client: Client) {
    console.log('NEW Client joined');
    client.send('GREETINGS', { hello: "world!" });
    this.state.createPlayer(client.sessionId);
    if (this.state.game.isStarted) {
      client.send('GAME_IN_PROGRESS');
    }
  }

  async onLeave(client) {
    // try {
    //     await this.allowReconnection(client, 15);
    // } catch(e) {
    this.state.removePlayer(client.sessionId);
    // }
  }

  onDispose() {
    console.log("Dispose StateHandlerRoom");
    this.state.endGame();
  }

}

class Giphy {
  static API_KEY = 'UtNOErTJUT3pMz69N8LJHB801hDkX8nM';
  static randomGifUrl = 'https://api.giphy.com/v1/gifs/search';

  static async getRandomGif(q) {
    const reqOpt = {
      uri: this.randomGifUrl,
      qs: {
        api_key: this.API_KEY,
        q,
        random_sessionId: new Date().getTime(),
      },
    };
    try {
      const res = await request.get(reqOpt);
      const data = JSON.parse(res).data;
      const item = data[Math.floor(data.length * Math.random())];
      return item && item.embed_url;
    } catch (e) {
      console.error(e);
      return false;
    }

  }
}
