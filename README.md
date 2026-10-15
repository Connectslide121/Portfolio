# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — JonOS

This branch turns the portfolio into a 90s desktop operating system.

- **Boot** — a BIOS that detects every material of the career, oldest first,
  then a splash (once per session; any key skips it).
- **Desktop** — hand-drawn 16x16 pixel icons; click to select, double-click
  to open (one tap on a phone). Windows drag, resize, minimise, maximise.
- **About_Me.txt** in Notepad, a **Career Setup Wizard** with a pixel scene
  per act, **Experience** in an Explorer, **Projects** as a folder that opens
  files in a Media Player, **Tools** as a Control Panel, **Mail** for contact.
- **Start menu** — programs, Display: Standard / Night, the pipes
  screensaver (also after 90 s idle) and Shut Down.
- Deep links: `#projects`, `#experience`, `#contact`, `#tools`, `#career`.

## Features

- **Single Page Application** built with React — a desktop with windows
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — a folder of files, each opening in a media player
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

