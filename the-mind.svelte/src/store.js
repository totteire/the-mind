import { writable } from 'svelte/store';

// GAME STORE
export const gameStore = writable({});
export const changeGame = (changes) =>
  changes.forEach(change =>
    gameStore.update(game => ({
    ...game,
      [change.field]: change.value
    }))
  );

// PLAYERS STORE
export const playersStore = writable({});
export const addPlayer = (player, sessionId) =>
  playersStore.update(players => ({
    ...players,
    [sessionId]: {...player}
  }));
export const changePlayer = (sessionId, changes) => {
  const primitiveChanges = changes.filter(c => c.field !== 'cards')
  primitiveChanges.forEach(change => 
    playersStore.update(players => ({
      ...players,
      [sessionId]: {
        ...players[sessionId],
        [change.field]: change.value
      }
    }))
  )
};
export const changePlayerList = (player, sessionId) =>
  playersStore.update(players => ({
    ...players,
    [sessionId]: {...player}
  }));
export const removePlayer = (player, sessionId) =>
  playersStore.update(players =>
    Object.keys(player)
      .filter(sid => sid !== sessionId)
      .reduce((obj, key) => {
        obj[key] = players[key];
        return obj;
      }, {})
  );
export const addPlayerCard = (sessionId, card, index) =>
  playersStore.update(players => {
    return {
    ...players,
    [sessionId]: {
      ...players[sessionId],
      cards: [...players[sessionId].cards, card],
    }
  }});
export const removePlayerCard = (sessionId, card, index) =>
  playersStore.update(players => ({
    ...players,
    [sessionId]: {
      ...players[sessionId],
      cards: players[sessionId].cards.slice(players[sessionId].cards.indexOf(card), 1),
    }
  }));

// ME STORE
export const me = writable({});
export const setMe = (newMe) => me.set(newMe);

// DECK STORE
export const deckStore = writable([]);
export const addToDeck = (number) =>
  deckStore.update(deck => [...deck, number]);
export const removeFromDeck = (number) =>
  deckStore.update(deck => deck.filter(n => n !== number));
