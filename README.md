# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — eleven modes

The portfolio ships eleven complete designs of the same CV. The site opens on
**Foundry**, the newest one; the other ten are a click away on the **picker**
(`?mode=picker`): Foundry across the first row, then a grid of the others
(each thumbnail in the light or dark theme you are looking at).
Every mode carries a small **style switcher** to step to the previous or next
design or to the picker, and Foundry links to it from its footer too.

| # | Mode | Kind |
|---|------|------|
| 1 | Foundry | A process sheet in steel: a live three.js billet that cools into a lattice as you read |
| 2 | Mendi | A generated mountain landscape, dawn by day and northern lights by night |
| 3 | Swiss | International Typographic Style, generative posters |
| 4 | Blueprint | An engineering drawing set |
| 5 | JonOS | A 90s desktop operating system |
| 6 | Chronicle | A broadsheet newspaper |
| 7 | Constellation | The career in the night sky |
| 8 | Stickers | Neo-brutalist sticker book |
| 9 | Quest | Top-down pixel RPG |
| 10 | Run | Side-scrolling platformer |
| 11 | Collect | Trading card game |

The bare address is Foundry. A mode lives at `?mode=<id>` (`foundry`, `mendi`, `swiss`, `blueprint`, `jonos`, `newspaper`,
`constellation`, `stickers`, `quest`, `run`, `collect`); the CV pages of the
games keep working at `?mode=<id>#cv`. Only the picked mode is downloaded,
with its own styles and fonts, and the light/dark choice is shared by all.
Foundry's billet loads three.js in a chunk of its own, only on screens at
least 900px wide with motion allowed and WebGL; everywhere else, and until it
has drawn, a still rendered from the same scene stands in.
Each design started on its own `claude/portfolio-redesign-*` branch.

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** shown eleven ways — one per mode — from the same project list
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

