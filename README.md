# Portfolio

A personal portfolio website built with React. It showcases the developer Jon Mendizabal, highlighting projects, experience and contact information. The site is deployed through GitHub Pages.

## Design — The Mendizabal Chronicle

This branch prints the portfolio as a broadsheet newspaper: a blackletter
masthead with a dateline worked out from today, Playfair headlines, Caslon
body set in justified columns between hairline rules, and a red spot colour.
Switch between the *Morning* (light) and *Night* (dark) edition.

- **Live halftone** — the front-page engraving and every featured project
  video are printed as newspaper dots, live, in CSS. Hover for the colour
  original.
- **Front page** — the lede as the lead headline, the three acts "from the
  archive", the current role and the profiles in the side columns.
- **Careers** as stories with pull quotes, education as notices, tools as
  listings, projects as reports and briefs.
- **The Chronicle Crossword** — playable, every answer is on the CV.
- **Letters to the editor** — the contact form.

## Features

- **Single Page Application** built with React and React Router style sections
- **Dark/Light theme toggle** implemented via CSS variables
- **Projects** — featured reports with halftone video, and briefs for the rest
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

