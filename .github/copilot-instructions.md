# Copilot Instructions for Jon Mendizabal's Portfolio

## Ending a session

End every session with a short recap for the user. Include only the points that have something to say — skip the rest entirely, and never write filler such as "no decisions were made":

- **Done** — what was changed or completed.
- **Need to know** — anything the user should be aware of: risks, things not verified, actions needed from them.
- **Decisions** — choices you made on the user's behalf that they should know about.
- **Next steps** — sensible follow-ups, if any.

---

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
├── App.jsx                # The OS: boot, desktop, windows, start menu,
│                          # taskbar, screensaver, shutdown, #hash links
├── index.js               # Entry point; restores the stored theme
├── os/                    # The operating system
│   ├── apps.js            # Program registry (title, icon, size, component)
│   ├── useWindows.js      # Window manager state
│   ├── Window.jsx         # Window chrome: drag, resize, caption buttons
│   ├── Desktop.jsx        # Icons, shortcuts, wallpaper
│   ├── Taskbar.jsx        # Start, task buttons, theme, clock
│   ├── StartMenu.jsx
│   ├── Boot.jsx, ShutDown.jsx, Screensaver.jsx
│   ├── pixels.js          # Palette, character maps, tiny rasteriser
│   ├── icons.js           # Hand-drawn 16x16 icons
│   ├── scenes.js          # Career wizard pixel scenes
│   └── PixelArt.jsx       # Renders pixels as crisp SVG
├── apps/                  # One component per program: AboutApp,
│                          # CareerWizard, ExperienceApp, ProjectsApp,
│                          # ProjectViewer, ToolsApp, MailApp, RecycleBin
├── components/            # projectList.js, richText.jsx, SocialIcon.jsx
├── data/                  # Content: journey.js (profile, experience,
│                          # education, chapters), tools, social, site copy,
│                          # media / tech / organisation lookups
├── styles/                # styles.css (tokens, bevels), os.css, apps.css
└── images/                # Static assets
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
- **Follow the existing CSS variable naming**: `--desk`, `--face`, `--hi`, `--lo`, `--dk`, `--ink`, `--client`, `--title-a`, `--select`, etc. (see `src/styles/styles.css`)
- **Use the bevel classes** (`.raised`, `.sunken`, `.btn95`, `.field95`, `.group-box`) rather than new borders
- **Dark theme support**: All new styles must support both light and dark themes
- **Responsive design**: Use existing breakpoint patterns
- **No inline styles**: Keep all styling in CSS files
- **CSS organization**: One CSS file per component when needed

```css
/* CSS Variable Pattern */
body {
  /* Standard */
  --desk: #008080;
  --face: #c0c0c0;
  --title-a: #000080;
  /* ... more variables */
}

body.dark-theme {
  /* Night */
  --desk: #1d1433;
  --face: #3a3946;
  --title-a: #5a1f8f;
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

### Navigation System

- The navbar uses scroll-based active state detection
- Active nav links are determined by scroll position relative to section heights
- Mobile navigation is toggle-based with overlay

### Theme System

- Light/dark theme switching via CSS custom properties
- Theme state is managed by toggling `dark-theme` class on `document.body`
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

### Adding a New Program (section)

1. Create the component in `src/apps/`
2. Register it in `APPS` in `src/os/apps.js` (title, label, icon, size)
3. Add its id to `DESKTOP` to give it a desktop icon and a Start menu entry
4. Draw a new icon in `src/os/icons.js` if none fits

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
