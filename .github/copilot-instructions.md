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
├── App.jsx                # The sky behind six sections
├── index.js               # Entry point; night sky (dark) unless "light" is stored
├── art/
│   ├── Sky.jsx            # Canvas starfield that turns with time and scroll
│   ├── StarAtlas.jsx      # Planisphere: tool categories as constellations
│   ├── Orrery.jsx         # Featured projects in orbit (hero)
│   ├── ActBody.jsx        # One celestial body per career act
│   ├── RadioDish.jsx      # Contact illustration
│   └── rng.js             # Seeded random numbers
├── components/            # Nav, ThemeToggle, SectionHead, Footer,
│   │                      # ProjectMedia (lazy video), ProjectLinks,
│   │                      # SocialIcon, hooks.js
│   ├── projectList.js     # Project data
│   └── richText.jsx       # {Link} / *bold* markup for data text
├── data/                  # Content: journey.js (profile, experience,
│                          # education, chapters), tools, social, site copy,
│                          # media / tech / organisation lookups
├── pages/                 # Home, Acts, Atlas, Path, Catalogue, Signal
├── styles/                # styles.css (tokens, shared) + one per section
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
- **Follow the existing CSS variable naming**: `--bg`, `--ink`, `--ink-2`, `--muted`, `--line`, `--glow`, `--cool`, `--card`, etc. (see `src/styles/styles.css`)
- **Dark theme support**: All new styles must support both light and dark themes
- **Responsive design**: Use existing breakpoint patterns
- **No inline styles**: Keep all styling in CSS files
- **CSS organization**: One CSS file per component when needed

```css
/* CSS Variable Pattern */
body {
  /* star atlas */
  --bg: #efe6d2;
  --ink: #2a1e10;
  --glow: #a8471d;
  /* ... more variables */
}

body.dark-theme {
  /* night sky */
  --bg: #05060f;
  --ink: #eef1ff;
  --glow: #ffc46b;
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

### Adding New Sections

1. Create component in `src/pages/` or `src/components/`
2. Add corresponding CSS file in `src/styles/`
3. Import and include in `App.jsx`
4. Add navigation link to `Navbar.jsx` if needed
5. Update scroll detection logic in navbar if it's a main section

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
