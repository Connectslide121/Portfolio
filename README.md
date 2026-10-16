# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — nine modes

The portfolio ships nine complete designs of the same CV, and visitors pick one.
The front page is the **picker**: a three-by-three grid of thumbnails (each
in the light or dark theme you are looking at). Every mode then carries a
small **style switcher** to step to the previous or next design or back to
the grid.

| # | Mode | Kind |
|---|------|------|
| 1 | Swiss | International Typographic Style, generative posters |
| 2 | Blueprint | An engineering drawing set |
| 3 | JonOS | A 90s desktop operating system |
| 4 | Chronicle | A broadsheet newspaper |
| 5 | Constellation | The career in the night sky |
| 6 | Stickers | Neo-brutalist sticker book |
| 7 | Quest | Top-down pixel RPG |
| 8 | Run | Side-scrolling platformer |
| 9 | Collect | Trading card game |

A mode lives at `?mode=<id>` (`swiss`, `blueprint`, `jonos`, `newspaper`,
`constellation`, `stickers`, `quest`, `run`, `collect`); the CV pages of the
games keep working at `?mode=<id>#cv`. Only the picked mode is downloaded,
with its own styles and fonts, and the light/dark choice is shared by all.
Each design started on its own `claude/portfolio-redesign-*` branch.

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** shown nine ways — one per mode — from the same project list
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

