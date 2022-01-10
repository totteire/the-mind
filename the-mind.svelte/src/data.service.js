

const host = window.document.location.host.replace(/:.*/, '');
const client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':2567' : ''));

let room;

const roomName = window.location.pathname.split('\/')[2];

export const listAvailableRooms = async () => await client.getAvailableRooms();

export const joinOrCreate = async (roomName) => {
    room = await client.joinOrCreate("the_mind", { roomName });
    room.onStateChange((state) => {
        console.log(room.name, "has new state:", state);
    });
    room.onMessage("GREETINGS", () => {
        setMe($players[room.sessionId]);
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
    room.onMessage((message) => {
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


// const availableRooms = await client.getAvailableRooms();
// console.log(availableRooms);

