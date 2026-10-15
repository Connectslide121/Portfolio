# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — Blueprint

This branch presents the portfolio as an engineering drawing set. Every
section is a numbered sheet with a double-ruled frame, zone references and a
title block, drawn in one line colour on cyanotype blue — or, with
*Print: White*, on whiteprint paper. Red is the checker's pencil.

- **Cover** — an exploded isometric view of the stack, standing on a hatched
  steel foundation (the foundry years). Click it to assemble / explode.
- **Process & parts** — the three acts as a flowchart, the tools as a bill of
  materials.
- **Revision history** — the career chain-dimensioned in years, then each
  role and degree as a lettered detail.
- **Works** — dimensioned project plates and a drawing register.
- **Change request** — the contact form, with an approval stamp.
- A crosshair and millimetre readout follow the mouse.

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — featured plates and a register of every other project
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
- `src/data/journey.js` — profile, experience, education, career chapters, stack
- `src/data/tools.js`, `src/data/social.js`, `src/data/site.js` — tools, profiles elsewhere, contact and section copy
- `src/data/projectMedia.js`, `projectTech.js`, `orgLogos.js` — media and logo lookups

## License

This repository is licensed under the MIT License. Feel free to use the code for your own portfolio or as inspiration.

