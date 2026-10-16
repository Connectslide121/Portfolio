// The dateline, worked out from today: volume = years since the first
// entry in the CV (2005), number = day of the year.

const ROMAN = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export const roman = (n) =>
  ROMAN.reduce((out, [v, s]) => {
    while (n >= v) {
      out += s;
      n -= v;
    }
    return out;
  }, "");

export function edition(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now - start) / 86400000);
  return {
    volume: roman(now.getFullYear() - 2005),
    number: day,
    date: new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(now),
  };
}
