import { writable } from 'svelte/store';

// GAME STORE
export const gameStore = writable({});
export const onGameChange = (changes) =>
  changes.forEach(change =>
    gameStore.update(game => ({
    ...game,
      [change.field]: change.value
    }))
  );

// PLAYERS STORE
export const playersStore = writable({});
export const onPlayerAdd = (player, sessionId) =>
  playersStore.update(players => ({
    ...players,
    [sessionId]: player
  }));
export const onPlayerChange = (player, sessionId) => {
  console.log(player);
  playersStore.update(players => ({
    ...players,
    [sessionId]: player
  }));
}
export const onPlayerRemove = (player, sessionId) =>
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
export const onDeckAdd = (number) =>
  deckStore.update(deck => [...deck, number]);
export const onDeckRemove = (number) =>
  deckStore.update(deck => deck.filter(n => n !== number));
