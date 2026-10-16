// The player's collection: what they own, what they have looked at, which
// trophies they have earned. Kept in localStorage so a visitor who comes
// back finds their album where they left it.

import { CARDS, RARITY, cardById, cardsOf, setById } from "./catalog";

const KEY = "jm-cards";

export const emptyCollection = () => ({
  owned: {},
  opened: 0,
  pulls: { holo: 0, legendary: 0 },
  inspected: {},
  trophies: {},
  night: false,
  traded: false,
  pairsBest: null,
});

export function loadCollection() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY));
    if (!saved) return emptyCollection();
    // Drop ids of cards that no longer exist (a project renamed, say).
    const owned = Object.fromEntries(Object.keys(saved.owned || {}).filter((id) => cardById[id]).map((id) => [id, true]));
    return { ...emptyCollection(), ...saved, owned };
  } catch {
    return emptyCollection();
  }
}

export function saveCollection(c) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* blocked storage: the album lasts as long as the tab */
  }
}

export const ownedIn = (setId, owned) => cardsOf(setId).filter((c) => owned[c.id]).length;

export const packsLeft = (setId, owned) => {
  const left = cardsOf(setId).length - ownedIn(setId, owned);
  return Math.ceil(left / setById(setId).packSize);
};

// Rarer cards are less likely to come out early, so the chase cards tend to
// sit in the later packs. Every pack holds only cards you do not have yet:
// a visitor never wastes a pack on a duplicate.
const WEIGHT = { common: 6, uncommon: 4, rare: 2.6, holo: 1.8, legendary: 1.2 };

export function drawPack(setId, owned, rand = Math.random) {
  let pool = cardsOf(setId).filter((c) => !owned[c.id]);
  const size = Math.min(setById(setId).packSize, pool.length);
  const pack = [];
  // The first Career pack always holds the hero.
  if (setId === "career" && !owned.hero) {
    pack.push(cardById.hero);
    pool = pool.filter((c) => c.id !== "hero");
  }
  while (pack.length < size) {
    const total = pool.reduce((t, c) => t + WEIGHT[c.rarity], 0);
    let x = rand() * total;
    let i = pool.findIndex((c) => (x -= WEIGHT[c.rarity]) <= 0);
    if (i < 0) i = pool.length - 1;
    pack.push(pool[i]);
    pool.splice(i, 1);
  }
  // Like the real thing: the best card waits at the back.
  return pack.sort((a, b) => RARITY[a.rarity].rank - RARITY[b.rarity].rank);
}

/** Add a pack's cards to the collection. */
export function addPack(c, cards) {
  const owned = { ...c.owned };
  const pulls = { ...c.pulls };
  for (const card of cards) {
    owned[card.id] = true;
    if (card.rarity === "holo") pulls.holo += 1;
    if (card.rarity === "legendary" && card.id !== "hero") pulls.legendary += 1;
  }
  return { ...c, owned, pulls, opened: c.opened + 1 };
}

const complete = (setId) => (c) => ownedIn(setId, c.owned) === cardsOf(setId).length;

export const TROPHIES = [
  { id: "first", name: "First pull", text: "Open your first booster.", test: (c) => c.opened >= 1 },
  { id: "hero", name: "Meet the hero", text: "Pull the hero card.", test: (c) => c.owned.hero },
  { id: "holo", name: "Shiny!", text: "Pull a holo rare.", test: (c) => c.pulls.holo > 0 },
  { id: "legend", name: "Legendary", text: "Pull a legendary card other than the hero.", test: (c) => c.pulls.legendary > 0 },
  { id: "story", name: "The whole story", text: "Look closely at all three chapter cards.", test: (c) => ["ch-steel", "ch-reset", "ch-software"].every((id) => c.inspected[id]) },
  { id: "sharp", name: "Card sharp", text: "Look closely at ten different cards.", test: (c) => Object.keys(c.inspected).length >= 10 },
  { id: "set-career", name: "Twenty years", text: "Complete the Career set.", test: complete("career") },
  { id: "set-projects", name: "Ship it", text: "Complete the Projects set.", test: complete("projects") },
  { id: "set-tools", name: "Full toolbox", text: "Complete the Toolbox set.", test: complete("tools") },
  { id: "pairs", name: "Total recall", text: "Clear a game of Pairs in the arcade.", test: (c) => c.pairsBest != null },
  { id: "night", name: "Night shift", text: "Play by lamplight (switch to the dark theme).", test: (c) => c.night },
  { id: "trade", name: "Let's trade", text: "Visit the trade desk.", test: (c) => c.traded },
  { id: "master", name: "Master collector", text: `Collect all ${CARDS.length} cards.`, test: (c) => CARDS.every((x) => c.owned[x.id]) },
];

/** Award what the collection now earns. Returns the new state and the fresh trophies. */
export function award(c) {
  const fresh = TROPHIES.filter((t) => !c.trophies[t.id] && t.test(c));
  if (!fresh.length) return { next: c, fresh };
  const trophies = { ...c.trophies };
  for (const t of fresh) trophies[t.id] = Date.now();
  return { next: { ...c, trophies }, fresh };
}
