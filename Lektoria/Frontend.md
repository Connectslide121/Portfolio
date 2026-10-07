You are an expert Angular 20 architect. Help me set up the frontend for a new SaaS web app.

### Project overview

I’m building an AI-powered lesson-planning platform for teachers in Sweden. Teachers will log in, upload or reference their own materials, and then use an AI assistant to generate and refine lesson plans aligned to the Swedish curriculum. The frontend is a secure Angular SPA that talks to a backend Azure Functions API.

### Tech stack & non-functional goals

- Framework: Angular 20 with standalone components and modern Angular features (signals, new control flow).
- Language: TypeScript, strict mode on.
- State management: Angular services + signals (NO NgRx for now).
- Styling: Tailwind CSS, with `@tailwindcss/forms` and `@tailwindcss/typography`.
- Icons: Lucide icons (Angular-friendly usage).
- Charts: `ngx-charts` for simple analytics (usage, lesson stats, etc.).
- Localization: `@ngx-translate/core` + `@ngx-translate/http-loader` for at least English and Swedish (en, sv).
- Auth: Azure AD B2C (Entra External ID) using MSAL:
  - `@azure/msal-browser`
  - `@azure/msal-angular`
- HTTP: Angular HttpClient talking to an Azure Functions backend secured with JWT (Bearer tokens from B2C).

The app should be structured so that it scales nicely: clean module boundaries, feature directories, and a small “core” with cross-cutting services.

### High-level frontend architecture

I want a structure roughly like this (adjust to Angular 20 best practices):

- `src/app/core/`
  - `auth/` – AuthService, MSAL config, guards, interceptors.
  - `services/` – global services (ApiClient, AiService, LessonPlanService, LayoutService).
  - `models/` – shared TypeScript interfaces (LessonPlan, Resource, User, Organization, etc.).
  - `config/` – app config, environment-based settings, API base URL, B2C config.
- `src/app/shared/`
  - Reusable UI components (buttons, cards, modals, form controls).
  - Pipes and small helpers.
- `src/app/features/`
  - `dashboard/` – overview, usage charts (using ngx-charts), “recent lesson plans”.
  - `lesson-planner/` – main AI-assisted planning flow:
    - lesson list
    - lesson editor
    - AI assistant panel (calls backend AI endpoints).
  - `resources/` – uploaded documents/resources for RAG.
  - `settings/` – profile, language selector, organization settings, etc.
- `src/app/layout/`
  - Layout components (shell, topbar, sidebar, responsive design).

Routing:
- Guard all internal routes with an MSAL-based auth guard.
- Public routes only for e.g. `/login` or a landing page, if needed.

Localization:
- Use `ngx-translate` with:
  - `assets/i18n/en.json`
  - `assets/i18n/sv.json`
- Add a simple language switcher in the topbar; store preference in localStorage for now.

### Tailwind & UI requirements

- Wire up Tailwind CSS properly for Angular 20:
  - Tailwind config tuned for a clean, minimal app (no crazy theme yet; just base colors, spacing).
  - Use `@tailwindcss/forms` for nicer form styling.
  - Use `@tailwindcss/typography` for rendering AI-generated lesson content.

- Add Lucide icons in a way that feels natural in Angular:
  - Either via `lucide-angular` or a small wrapper component that renders Lucide icons.

### Auth requirements (Azure AD B2C + MSAL)

- Set up MSAL Angular with placeholders for:
  - B2C authority
  - clientId
  - knownAuthorities
  - redirect URI
- Add:
  - An MSAL interceptor that attaches the access token for calls to the API base URL.
  - A route guard that ensures only authenticated users can access the main app (dashboard, lesson-planner, resources, settings).

I will later plug in the real B2C values; use dummy placeholders in code for now.

### Charts

- Install and configure `ngx-charts`.
- Add a simple `DashboardChartComponent` using ngx-charts with dummy data (e.g. lessons created per week).
- Make sure styles work correctly with Tailwind.

### What I want you to do now

1. Propose the concrete Angular CLI commands (for Angular 20) to:
   - Create the project with standalone components and routing.
   - Add Tailwind.
   - Add the libraries: ngx-translate, lucide, ngx-charts, MSAL.
2. Propose the folder structure (with filenames) for `core`, `shared`, `features`, and `layout`.
3. Generate the initial TypeScript/HTML/SCSS (or Tailwind-based) code for:
   - The main app shell (layout with sidebar + topbar).
   - A dummy dashboard page with a sample ngx-charts chart.
   - The basic MSAL integration (config, interceptor, guard) with placeholder B2C settings.
   - The ngx-translate setup and a very simple `en.json` and `sv.json`.

Make all code examples follow Angular 20 patterns (standalone components, typed inputs, signals where appropriate). You don’t need to fully implement every feature; focus on scaffolding a clean, extensible architecture I can build on.
