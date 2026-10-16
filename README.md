# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — Quest

This branch turns the portfolio into a top-down pixel RPG. Walk the career
west to east — Spain, India, Sweden — with the arrow keys or WASD, by tapping
where to go, or with the on-screen pad on a phone.

- **Buildings tell the story**: walk into the university, the AML foundry,
  Lea-Artibai, the plant in India, Lexicon or Sprinta and its people talk you
  through each role or degree, quest by quest, in a JRPG dialogue box.
- **The Arcade** holds every project as a cabinet, **the Workshop** every tool
  as an item in your bag, **the Post Office** the contact form.
- **Quest log** (Q), **bag** (I), **world map** with fast travel (M) and
  **trophies** (T): earn XP, level up and unlock twelve achievements.
- **Night** (the dark theme) darkens the world and lights the lamps and
  windows.
- **Read as CV** shows everything on one plain page (also at `#cv`).

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — an arcade cabinet each, plus a plain list on the CV page
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

