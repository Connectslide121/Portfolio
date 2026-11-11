import { profile } from "../../../data/journey";

// The blurb is one paragraph in the data. The hero only has room for its
// first sentence; the story section carries the rest.
const cut = profile.blurb.indexOf(". ");

export const blurbOpening = cut > 0 ? profile.blurb.slice(0, cut + 1) : profile.blurb;
export const blurbRest = cut > 0 ? profile.blurb.slice(cut + 2) : "";

/** 56.88 -> "56.88° N" */
export const degrees = (value, positive, negative) => `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
