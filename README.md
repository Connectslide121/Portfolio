# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — Constellation

This branch sets the portfolio in the sky. A canvas starfield turns slowly
behind the page and further as you scroll; now and then a meteor. Switch
between the *Night sky* (dark, default) and the *Star atlas* (light), the
same sky printed in ink on old paper.

- **Orrery** — the featured projects orbit the initials; click a planet.
- **Three ages** — a red giant (steel), an eclipse (reset), a blue star with
  a planet (software).
- **Atlas** — every tool category is a constellation with a Latin name,
  every tool a star. Hover a star to read it.
- **The path** — work and education on one comet track, its head at today,
  its tail running back, hotter, to the foundry.
- **Catalogue** — projects as numbered objects (JM 1–19) in planet discs.
- **Signal** — the contact form, with a radio dish.

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — a catalogue of numbered objects
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

