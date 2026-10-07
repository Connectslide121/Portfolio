# Lektoria - AI Coding Agent Instructions

## Project Overview

Lektoria is an AI-powered lesson-planning SaaS for Swedish teachers. Teachers authenticate, upload materials, and use AI to generate curriculum-aligned lesson plans.

## Architecture

### Frontend (Angular 20 SPA)

- **Location**: `LektoriaClient/`
- **Stack**: Angular 20 (standalone components, zoneless), TypeScript strict, Tailwind CSS, MSAL for Azure AD B2C auth
- **Key patterns**:
  - Standalone components only (no NgModules)
  - Never use single file components (separate HTML/TS/CSS files)
  - Signals for state management (no NgRx)
  - Lazy-loaded feature routes via `loadComponent()` in `app.routes.ts`
  - ngx-translate for i18n (en/sv) - translation files in `src/assets/i18n/`

### Backend (Planned - Azure Functions .NET 8)

- **Spec**: `Backend.md` describes the target architecture
- **Stack**: Azure Functions isolated process, Cosmos DB (with vector search), Azure OpenAI
- **Not yet implemented** - use Backend.md as the specification

### External APIs

- **Skolverket Syllabus API**: Swedish curriculum, subjects, courses data
  - Full documentation: `docs/SKOLVERKET_API.md`
  - Base URL: `https://api.skolverket.se/syllabus`
  - Key endpoints: `/v1/subjects`, `/v1/courses`, `/v1/curriculums`
  - No auth required, responses cached 60 min

## Frontend Structure

```
src/app/
├── core/           # Cross-cutting: auth config, services, models
│   ├── config/     # auth.config.ts (MSAL/B2C settings)
│   └── services/   # API services (lesson-plan.service.ts)
├── features/       # Feature components (dashboard, lesson-planner, resources, settings)
├── layout/         # App shell: layout.component.ts, sidebar.component.ts, topbar.component.ts
└── shared/         # Reusable UI components (currently empty, add here)
```

## Key Development Patterns

### Component Creation

- Always use standalone components with explicit imports
- Use `inject()` function over constructor injection (see `topbar.component.ts`)
- Import `TranslateModule` for i18n, `LucideAngularModule` for icons
- Use Tailwind classes directly in templates (no separate SCSS files needed)

### Icons (Lucide)

```typescript
import { LucideAngularModule, IconName } from "lucide-angular";
// In component: readonly IconName = IconName;
// In template: <lucide-icon [img]="IconName" class="w-5 h-5"></lucide-icon>
```

### Localization

- Add keys to both `src/assets/i18n/en.json` and `sv.json`
- Use nested keys: `{{ 'SECTION.KEY' | translate }}`
- Language preference stored in localStorage as `'lang'`

### Authentication

- MSAL configured in `core/config/auth.config.ts` (uses placeholders)
- MsalGuard available but currently disabled for dev (`app.routes.ts`)
- API endpoint placeholder: `http://localhost:7071/api`

### Routing

- Public route: `/` (landing)
- Protected routes under `LayoutComponent`: `/dashboard`, `/lesson-planner`, `/resources`, `/settings`
- Add new feature routes as children of the layout route in `app.routes.ts`

## Commands

```bash
cd LektoriaClient
npm start       # Dev server with auto-open (ng serve --open)
npm run build   # Production build
npm test        # Karma tests
```

## Styling Guidelines

- Use Tailwind utility classes; plugins: `@tailwindcss/forms`, `@tailwindcss/typography`
- Card pattern: `bg-white p-6 rounded-xl shadow-sm border border-gray-100`
- Sidebar: dark theme (`bg-gray-900`), main content: light (`bg-gray-50`)

## Adding New Features

1. Create component in `src/app/features/<feature-name>/`
2. Add lazy route in `app.routes.ts` under LayoutComponent children
3. Add sidebar link in `sidebar.component.ts` with appropriate Lucide icon
4. Add translation keys to both i18n files
5. Create service in `core/services/` if API calls needed
