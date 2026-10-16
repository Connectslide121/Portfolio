# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — Run

This branch turns the portfolio into a side-scrolling pixel platformer: one
long level that runs from 2005 to today. Run and jump with the arrow keys,
WASD and Space, or with the on-screen buttons on a phone.

- **Every stage is a CV entry**: the university campus, the AML foundry (mind
  the molten steel), the plant in India, the Swedish snow at Lexicon and the
  software years at Sprinta. Each flag opens the full role or degree.
- **? blocks** hold the skills of each stage, **coins** are the projects, laid
  out by date, and **bugs** wait to be stomped in the software years.
- **Collection** shows the projects you picked up, skills by stage and the
  toolbox; **Stages** travels to any flag already reached. Reach the goal for
  your stats and the contact form.
- **Night** (the dark theme) swaps every sky for its night palette.
- **Read as CV** shows everything on one plain page (also at `#cv`).

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — coins along the level, in the Collection, plus a plain list on the CV page
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

