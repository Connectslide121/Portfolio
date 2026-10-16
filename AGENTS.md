# Agent Instructions — Jon Mendizabal's Portfolio

## Commits

- **Commit as you go**, in small, logical commits: each commit is one coherent change — a feature step, a fix or a refactor, together with its tests and docs — with a clear message saying what changed and why. Don't bundle unrelated changes, and don't leave finished work uncommitted.
- **Don't push.** Commit only: the user reviews and pushes the commits themself (a push starts the pipeline builds). Never force-push or rewrite history that has already been pushed.
- **No AI attribution in commit messages.** Don't add `Co-Authored-By` trailers or any "generated with" lines.

## Ending a session

End every session with a short recap for the user. Include only the points that have something to say — skip the rest entirely, and never write filler such as "no decisions were made":

- **Done** — what was changed or completed.
- **Need to know** — anything the user should be aware of: risks, things not verified, actions needed from them.
- **Decisions** — choices you made on the user's behalf that they should know about.
- **Next steps** — sensible follow-ups, if any.

---

## Agent instructions and skills

This file is the single source of instructions for every coding agent. Copilot and
Codex read `AGENTS.md` directly; `CLAUDE.md` only imports it (`@AGENTS.md`). Never put
rules in `CLAUDE.md` or recreate `.github/copilot-instructions.md`.

Task-specific know-how lives as skills in `.claude/skills/<name>/SKILL.md`, which both
Claude Code and GitHub Copilot load when a task matches the skill's description. When a
change makes a skill or these instructions out of date, update them in the same commit.

## Project Overview

This is a personal portfolio website built with React 18, showcasing Jon Mendizabal's work as a full-stack developer. It's a single-page application deployed on GitHub Pages with a focus on clean, modern design and responsive functionality.

## Architecture & Structure

- **Framework**: React 18 (functional components with hooks)
- **Styling**: Vanilla CSS with CSS Custom Properties (CSS Variables) for theming
- **Components**: Functional components using ES6+ syntax
- **State Management**: React hooks (useState, useEffect)
- **Icons**: FontAwesome React components
- **Deployment**: GitHub Pages with automated deployment

### File Structure

```
src/
├── index.js               # Reads ?mode=, loads that mode (or the picker),
│                          # its fonts, favicon and theme default
├── picker/                # Picker (the 3x3 front page), ModeSwitch (the pill
│                          # over every mode) and their CSS
├── modes/
│   ├── registry.js        # The nine modes: name, blurb, fonts, colours, loader
│   └── <id>/              # One complete design per folder: main.js (its CSS
│                          # and App), App.jsx, its components, styles, art
├── components/            # Shared content: projectList.js, richText.jsx
├── data/                  # Content: journey.js (profile, experience,
│                          # education, chapters, beats), tools, social,
│                          # site copy, media / tech / organisation lookups
└── images/                # Static assets; images/modes/ holds the thumbnails
public/modes/<id>/         # Each mode's favicon
```

## Coding Standards & Conventions

### React Components

- **Always use functional components** with hooks
- **Use default exports** for all components
- **Component naming**: PascalCase for files and components
- **Import order**: React imports first, then local imports, then assets
- **Props destructuring**: Use destructuring in function parameters when appropriate

```jsx
// Preferred component structure
import React, { useState, useEffect } from "react";
import "../styles/component.css";
import asset from "../images/asset.webp";

export default function ComponentName() {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, []);

  return <section id="component-name">{/* Component JSX */}</section>;
}
```

### CSS & Styling

- **Use CSS Custom Properties** extensively for theming
- **Each mode owns its CSS variables** — see `src/modes/<id>/styles/styles.css` for that mode's tokens. A mode's styles load only with that mode, so they may style `body` freely; never import one mode's styles from another, or from `src/picker`.
- **The picker and the switcher** keep their own tokens (`--pk-*`) and the switcher everything under `.mode-switch`, because it is drawn over every mode
- **Dark theme support**: All new styles must support both light and dark themes
- **Responsive design**: Use existing breakpoint patterns
- **No inline styles**: Keep all styling in CSS files
- **CSS organization**: One CSS file per component when needed

```css
/* CSS Variable Pattern */
body {
  /* each mode's tokens, e.g. Collect's play mat */
  --bg: #efe5d0;
  --ink: #1d1733;
  /* ... more variables */
}

body.dark-theme {
  --bg: #15112a;
  --ink: #f3eefe;
  /* ... dark theme overrides */
}
```

### State Management

- **Use useState** for local component state
- **Use useEffect** for side effects and lifecycle events
- **Keep state close to where it's used**
- **Lift state up** only when necessary for sharing between components

### Event Handling

- **Smooth scrolling**: Use `scrollIntoView({ behavior: "smooth" })` for navigation
- **Theme switching**: Toggle `dark-theme` class on document.body
- **Mobile menu**: Use state to control mobile navigation visibility

## Project-Specific Guidelines

### Modes and Navigation

- `src/index.js` picks what to render from `?mode=<id>`: no mode (or an unknown one) shows the picker
- Moving between modes is a full page load (plain links), so only one mode's code and styles are ever on the page
- Each mode keeps its own in-page navigation (its own nav, hashes like `#cv`)

### Theme System

- Light/dark theme switching via CSS custom properties
- Theme state is managed by toggling `dark-theme` class on `document.body`, stored as `jm-theme` and shared by every mode and the picker; without a stored choice a mode uses its `darkByDefault`
- All components must support both themes using CSS variables

### Project Data Management

- Project information is stored in `src/components/projectList.js`
- Use `featuredProjects` for main showcase, `allProjects` for complete list
- Media assets are imported statically and mapped by project title

### Media Handling

- Use WebP format for images when possible
- Support both video (.mp4) and image (.webp) project previews
- Videos should be set to `autoPlay loop muted playsInline`

## Adding New Content

### Adding a New Project

1. Add project data to `projectList.js` in appropriate array
2. Add media file to `src/images/projects/`
3. Import the media in `src/data/projectMedia.js` and add it to the `VIDEOS` or `IMAGES` map
4. Ensure project has required fields: title, description, technologies, repository, etc.

### Adding a New Technology/Tool

1. Add icon to `src/images/tools/`
2. Add it to `toolCategories` in `src/data/tools.js`
3. Ensure icon follows the naming convention (lowercase, no spaces)

### Adding or Changing a Mode

1. A mode is a folder in `src/modes/<id>/` with a `main.js` that imports its stylesheets and re-exports its `App`; inside it, import shared content with relative paths up to `src/data` and `src/components`
2. Register it in `MODES` in `src/modes/registry.js` (name, kind, blurb, Google Fonts query, theme colour, `darkByDefault` if night is its default, `switchAt` if the switcher should sit in another corner)
3. Add its favicon as `public/modes/<id>/favicon.svg` and its thumbnails as `src/images/modes/<id>-light.webp` and `<id>-dark.webp` (800×500, a 1440×900 screenshot scaled down, with the switcher hidden)
4. Content changes go in `src/data` and `src/components` only, so every mode picks them up
5. When replacing `window.location` parts (`history.replaceState`), keep `window.location.search`, or the mode is lost on reload

## Performance & Best Practices

### Image Optimization

- Use WebP format for better compression
- Provide alt text for all images
- Use appropriate image sizes for different screen sizes

### Accessibility

- Maintain semantic HTML structure
- Use proper ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast in both themes

### Code Organization

- Keep components small and focused
- Extract reusable logic into custom hooks when beneficial
- Use meaningful variable and function names
- Comment complex logic, especially in scroll detection

## Development Workflow

### Local Development

```bash
npm start          # Start development server
npm run build      # Create production build
npm run deploy     # Deploy to GitHub Pages
```

### Deployment

- The site auto-deploys to GitHub Pages via the `deploy` script
- Production builds are created in the `build/` directory
- The homepage in package.json points to the GitHub Pages URL

## Common Patterns

### Smooth Scrolling Navigation

```jsx
const scrollToSection = () => {
  document.getElementById("section-id").scrollIntoView({ behavior: "smooth" });
};
```

### Theme Toggle Implementation

```jsx
const handleToggle = (event) => {
  if (event.target.checked) {
    document.body.classList.remove("dark-theme");
  } else {
    document.body.classList.add("dark-theme");
  }
};
```

### Project Media Mapping

```jsx
const assignMedia = (project) => {
  // Check video projects first, then images, fallback to placeholder
  if (videoProjects[project.title]) {
    return { type: "video", src: videoProjects[project.title] };
  } else if (imageProjects[project.title]) {
    return { type: "image", src: imageProjects[project.title] };
  } else {
    return { type: "image", src: fallbackImage };
  }
};
```

When modifying this portfolio, maintain the existing design language, ensure cross-browser compatibility, and test both light and dark themes. Keep the focus on clean, professional presentation of Jon's development work and experience.
