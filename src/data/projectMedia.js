// Project media, resolved by project title. Shared by Résumé mode's project
// cards and Journey mode's closing gallery so the two cannot drift (D9).

import DAIETpedia from "../images/projects/daietpedia.mp4";
import CodepenAI from "../images/projects/CodepenAI.mp4";
import PasswordInput from "../images/projects/password-input.mp4";
import PlasticSlurg from "../images/projects/plastic-slurg.mp4";
import Listr from "../images/projects/listr.mp4";
import Sokoban from "../images/projects/Sokoban.mp4";
import SlidingPuzzles from "../images/projects/sliding-puzzles.mp4";
import FlapryBlirb from "../images/projects/flapry-blirb.mp4";
import ContactBook from "../images/projects/contact-book.mp4";

import Calculator from "../images/projects/calculator.webp";
import imageGenerator from "../images/projects/ai-image-generator.webp";
import imageSearchApp from "../images/projects/image-search-app.webp";
import CommunityPortal from "../images/projects/community-portal.webp";
import VendingMachine from "../images/projects/vending-machine.webp";
import SpotifyClone from "../images/projects/spotify-clone.webp";
import LawnMowerRental from "../images/projects/lawn-mower-rental.webp";
import PatisserieLente from "../images/projects/patisserie-lente.webp";
import none from "../images/projects/none.jpg";

const VIDEOS = {
  DAIETpedia,
  CodepenAI,
  "Password input npm package": PasswordInput,
  "Plastic Slurg": PlasticSlurg,
  Listr,
  "Sokoban game": Sokoban,
  "Sliding puzzles": SlidingPuzzles,
  "Flapry Blirb": FlapryBlirb,
  "Contact book": ContactBook,
};

const IMAGES = {
  Calculator,
  "AI image generator": imageGenerator,
  "AI Image Generator": imageGenerator,
  "Image search app": imageSearchApp,
  "Community portal": CommunityPortal,
  "Vending machine": VendingMachine,
  "Spotify clone": SpotifyClone,
  "Lawn mower rental": LawnMowerRental,
  "Patisserie Lente": PatisserieLente,
};

export const FALLBACK_IMAGE = none;

/** @returns {{ type: "video" | "image", src: string }} */
export function mediaFor(title) {
  if (VIDEOS[title]) return { type: "video", src: VIDEOS[title] };
  if (IMAGES[title]) return { type: "image", src: IMAGES[title] };
  return { type: "image", src: none };
}

export const hasRealMedia = (title) =>
  Boolean(VIDEOS[title] || IMAGES[title]);
