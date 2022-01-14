import {
  playersStore as players,
  onDeckAdd,
  onDeckRemove,
  onGameChange,
  onPlayerAdd,
  onPlayerChange,
  onPlayerRemove,
  setMe
} from "./store";

const host = window.document.location.host.replace(/:.*/, '');
const client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':2567' : ''));

let room;

const roomName = window.location.pathname.split('\/')[2];

export const joinOrCreate = async (roomName) => {
  roomName = roomName || 'default';
  const rooms = await client.getAvailableRooms();
  console.log(rooms);
  const myRoom = rooms.find(r => r.metadata.roomName === roomName);
  if (myRoom) {
    room = await client.joinById(myRoom.roomId);
  } else {
    room = await client.create('the_mind', { roomName });
  }
  room.onStateChange((state) => {
    console.log(room.name, "has new state:", state);
  });
  room.onMessage("GREETINGS", () => {
    const unsubscribe = players.subscribe(players => {
      console.log('subscribed players', players);
      setMe(players[room.sessionId]);
    });
  });
  room.onMessage("MISTAKE", (message) => {
    console.log(message);
  });
  room.onMessage("LEVEL_UP", (message) => {
    console.log(message);
  });
  room.onMessage("WIN", (message) => {
    console.log(message);
  });
  room.onMessage("LOOSE", (message) => {
    console.log(message);
  });
  room.onMessage("GAME_IN_PROGRESS", (message) => {
    console.log(message);
  });
  room.onError((code, message) => {
    console.log(client.id, "couldn't join", room.name);
  });

  room.state.players.onAdd = (player, sessionId) => onPlayerAdd(player, sessionId);
  room.state.players.onRemove = (player, sessionId) => onPlayerRemove(player, sessionId);
  room.state.players.onChange = (player, sessionId) => onPlayerChange(player, sessionId);

  room.state.deck.onAdd = (number) => onDeckAdd(number);
  room.state.deck.onRemove = (number) => onDeckRemove(number);

  room.state.game.onChange = (changes) => onGameChange(changes);
}

export const setPlayerName = (name) => room && room.send('action', { name });
export const startGame = () => room.send('action', { action: 'START_GAME' });
export const playCard = (card) => room.send('action', { action: 'PLAY_CARD', card });

