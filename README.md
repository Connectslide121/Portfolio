# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — Collect

This branch turns the portfolio into a trading card game. The career is a
58-card collection in three sets — Career, Projects and Toolbox — opened
booster by booster and kept in an album.

- **Boosters**: tap or swipe a pack to tear it open, then turn the cards over.
  Rare cards glow through their backs; holo and legendary cards carry a foil
  that follows the pointer as the card tilts. Every pack holds only cards you
  do not have yet, and the first Career pack always holds the hero.
- **The album** is a binder page per set, with numbered empty pockets for
  what is still missing. Every card opens to its full CV entry — role,
  challenge and goal, bullets with links, skills that open their tool cards,
  the project's video and links, and for a tool every card that uses it.
- **Trophies** (thirteen of them), **Pairs** (a memory game with your own
  cards) and **the trade desk** (the contact form).
- **Night** (the dark theme) moves the game from a printed play mat to felt
  under a lamp. The collection is saved in the browser.
- **Read as CV** shows everything on one plain page (also at `#cv`).

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — a card each in the Projects set, plus a plain list on the CV page
- **About section** summarising tools, work experience and education
- **Responsive design** suitable for mobile and desktop screens
- **Contact form** powered by [Getform](https://getform.io/)

## Getting Started

Clone the repository and install the dependencies:

```bash
npm install
```

To start a local development server run:

```bash
npm start
```

This launches the React app in development mode at `http://localhost:3000/`.

To create an optimized production build use:

```bash
npm run build
```

## Deployment

The project is configured for deployment to GitHub Pages using the `gh-pages` package. Run the following commands to build and deploy:

```bash
npm run predeploy
npm run deploy
```

## Project Structure

```
public/        Static files and HTML template
src/           React components, pages and styles
src/images/    Media assets used on the site
```

Content lives in data files, separate from the layout:

- `src/components/projectList.js` — projects
- `src/data/journey.js` — profile, experience, education, career chapters
- `src/data/tools.js`, `src/data/social.js`, `src/data/site.js` — tools, profiles elsewhere, contact and section copy
- `src/data/projectMedia.js`, `projectTech.js`, `orgLogos.js` — media and logo lookups

## License

This repository is licensed under the MIT License. Feel free to use the code for your own portfolio or as inspiration.

