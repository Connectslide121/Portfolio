// The Chronicle's puzzle: seven answers from the CV, laid on a 7 x 10 grid.
// Coordinates are [row, col]; every crossing was checked by hand so no two
// words touch except where they share a letter.

export const ROWS = 7;
export const COLS = 10;

export const WORDS = [
  { n: 1, dir: "across", row: 0, col: 0, answer: "ANGULAR", clue: "Framework under Lektoria and the new Podium Suite" },
  { n: 3, dir: "across", row: 2, col: 0, answer: "UNITY", clue: "Engine behind Plastic Slurg and Flapry Blirb" },
  { n: 5, dir: "across", row: 4, col: 5, answer: "STEEL", clue: "Material of the foundry years" },
  { n: 6, dir: "across", row: 6, col: 1, answer: "RAG", clue: "Grounding behind Knowia Studio's course generator" },
  { n: 1, dir: "down", row: 0, col: 0, answer: "AZURE", clue: "Cloud the Functions in the stack run on" },
  { n: 2, dir: "down", row: 0, col: 6, answer: "REACT", clue: "Library of the very first app, a calculator" },
  { n: 4, dir: "down", row: 2, col: 2, answer: "INDIA", clue: "Where a second plant came up to standard in 2017" },
];

/** cells["r,c"] = { answer, n? } for every white square. */
export function buildGrid() {
  const cells = {};
  for (const w of WORDS) {
    [...w.answer].forEach((ch, i) => {
      const r = w.row + (w.dir === "down" ? i : 0);
      const c = w.col + (w.dir === "across" ? i : 0);
      const key = `${r},${c}`;
      if (cells[key] && cells[key].answer !== ch) {
        throw new Error(`Puzzle clash at ${key}: ${cells[key].answer} vs ${ch}`);
      }
      cells[key] = { ...cells[key], answer: ch };
      if (i === 0) cells[key].n = w.n;
    });
  }
  return cells;
}

/** The cells a word covers, in order. */
export const wordCells = (w) =>
  [...w.answer].map((_, i) => `${w.row + (w.dir === "down" ? i : 0)},${w.col + (w.dir === "across" ? i : 0)}`);
