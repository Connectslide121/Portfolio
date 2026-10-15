# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — Sticker book

This branch is loud on purpose: neo-brutalism with thick outlines, hard
offset shadows, six flat colours and chunky Bricolage Grotesque type, with
hand-written asides. Day is cream paper; night is aubergine with cream
outlines.

- **Stickers** — seven hand-drawn die-cut stickers around the hero. Grab one
  and move it; arrow keys work too.
- **The story** on taped notes, **tools** on sticker sheets, **experience**
  as tickets with a stamp on the live role.
- **Projects** as chunky cards you can filter: AI, apps & sites, games,
  tools & APIs.
- **Say hello** — a speech bubble, a one-click copy for the email address,
  and the form.

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — filterable cards, featured ones twice the size
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

