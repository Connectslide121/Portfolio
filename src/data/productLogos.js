// Each product's own mark, by the id used in products.js. They come from the
// products' repositories and are all drawn for a light ground, so show them
// on a white tile in either theme.

import podium from "../images/products/podium.webp";
import knowia from "../images/products/knowia.webp";
import govensa from "../images/products/govensa.svg";
import jambiz from "../images/products/jambiz.webp";
import certumhub from "../images/products/certumhub.svg";

const LOGOS = { podium, knowia, govensa, jambiz, certumhub };

/** @returns {string | undefined} the logo's URL, when the product has one. */
export const logoFor = (id) => LOGOS[id];
