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
    [sessionId]: player
  }));
export const changePlayer = (player, sessionId) => {
  console.log('Player has changed:', player);
  playersStore.update(players => ({
    ...players,
    [sessionId]: player
  }));
}
export const removePlayer = (player, sessionId) =>
  playersStore.update(players =>
    Object.keys(player)
      .filter(sid => sid !== sessionId)
      .reduce((obj, key) => {
        obj[key] = players[key];
        return obj;
      }, {})
  );

// ME STORE
export const me = writable({});
export const setMe = (newMe) => me.set(newMe);

// DECK STORE
export const deckStore = writable([]);
export const addToDeck = (number) =>
  deckStore.update(deck => [...deck, number]);
export const removeFromDeck = (number) =>
  deckStore.update(deck => deck.filter(n => n !== number));
