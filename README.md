# Horse Racing Simulator

[![CI](https://github.com/YOUR_USERNAME/horse_racing/workflows/CI/badge.svg)](https://github.com/YOUR_USERNAME/horse_racing/actions)

A Vue 3 + Vite app simulating multi‑round horse races. It uses Pinia for state, Vue Router for navigation, and a small
set of UI components. Unit tests run on Vitest and E2E on Playwright.

## What it does

- Generates a stable of 20 horses with base stats (name, color, base speed, initial condition).
- Picks 10 horses to be the fixed participants for the race card.
- Runs 6 rounds (laps) with predefined distances; the same 10 horses participate in all rounds.
- Before each round, every horse’s condition is re‑rolled; effective speed is recalculated from base speed × condition%.
- Simulates each round, tracks positions, and produces final rankings for the round.
- Home: click `Start Racing →` to enter the Race page.
- Race page: start/pause/resume, view the program (schedule), control speed, and see per‑round results.
- Speed presets are selectable before the race and disabled during the race.

## Tech stack

- Vue 3, Vite, TypeScript
- Pinia (stores), Vue Router
- Tailwind CSS (via `@tailwindcss/vite`)
- Vitest (unit), Playwright (e2e)

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`

## Getting started

Project setup:

- `npm install`

Development server:

- `npm run dev`
- App served by Vite with HMR

Type‑check and build:

- `npm run type-check` (uses `vue-tsc`)
- `npm run build` (type-check + Vite build)
- `npm run preview` (serve production build)

Linting:

- `npm run lint`
- `npm run lint:fix`

## Running tests

Unit tests (Vitest):

- `npm run test:unit`

End‑to‑end tests (Playwright):

- First time, install browsers: `npx playwright install`
- Desktop tests: `npm run test:e2e:desktop` (Chromium) - **used in CI/CD**
- Mobile tests: `npm run test:e2e:mobile` (Pixel 5 viewport) - **used in CI/CD**
- All projects: `npm run test:e2e` (chromium, firefox, webkit, Mobile Chrome)
- Single project: `npm run test:e2e -- --project=firefox`
- Single file: `npm run test:e2e -- e2e/raceFlow.spec.ts`
- Debug mode: `npm run test:e2e -- --debug`

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

**Initial setup:**

1. Enable GitHub Pages in your repository settings:
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. Push to the `master` branch to trigger the deployment workflow

3. Your app will be available at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

**How it works:**

The deployment is configured across three files:

- **`vite.config.ts`**: Configures the base path for GitHub Pages
  - Reads `GH_PAGES_BASE` environment variable during build
  - Uses `/repository-name/` for production, `/` for development
  - Ensures proper asset loading on GitHub Pages subdirectory

- **`.github/workflows/gh-pages.yml`**: GitHub Actions workflow
  - Triggers on push to `master` branch or manual dispatch
  - Builds the project with correct base path: `GH_PAGES_BASE=/<repo-name>/`
  - Creates `404.html` from `index.html` for SPA routing fallback
  - Deploys `dist/` folder to GitHub Pages

- **`playwright.config.ts`**: Supports E2E testing against deployed site
  - Can override base URL via `PLAYWRIGHT_BASE_URL` environment variable
  - Useful for testing the actual deployed application

**Manual deployment:**

You can trigger deployment manually from GitHub:
- Go to **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

**Local preview of production build:**

```bash
npm run build    # Build with production settings
npm run preview  # Preview on http://localhost:4173
```

## Testing strategy

- Unit tests focus on logic-heavy surfaces: stores, composables, and utils. Core components that encapsulate logic are also covered.
- App shell and thin view wrappers are excluded from unit coverage to avoid noisy, low‑value failures:
  - Excluded from coverage: `src/main.ts`, `src/App.vue`, `src/pages/**`, `src/router/**`, and generic UI wrappers under `src/components/ui/**`.
  - Rationale: these compose other pieces and are validated by E2E; exercising them with shallow unit tests duplicates Playwright's responsibility and distorts coverage.
- E2E tests cover page rendering and primary flows (Home → Race, start/pause/resume, speed control, slide‑over, results, confirmation modal), using stable `data-testid` selectors and state‑based waits (`aria-expanded`, live status) for reliability.

### Mobile Responsive Testing

The app uses extensive mobile-responsive CSS (90+ responsive breakpoints across 11 components) with Tailwind's `sm:`, `md:`, `lg:` utilities. Mobile and desktop have different layouts, styling, and UX patterns.

**Testing approach:**
- **All tests run on both desktop and mobile viewports** to verify responsive behavior works correctly across screen sizes
- **Desktop tests (Chromium)** verify that mobile-responsive styles scale up properly and don't break wide layouts
- **Mobile tests (Pixel 5 viewport)** verify that mobile-specific layouts, touch targets, and viewport-constrained features work correctly
- **Viewport-specific tests** use `test.skip(!isMobile)` to conditionally skip (e.g., horizontal scroll test only makes sense on mobile where track width exceeds viewport)
- **Mobile tests are tagged** with `@mobile` for documentation and optional filtering, but still run on both viewports by default

**Why both viewports run the same tests:**
- Catches regressions when mobile styles break desktop layouts or vice versa
- Ensures responsive breakpoints transition correctly (mobile → tablet → desktop)
- Validates that touch-friendly sizing doesn't negatively impact desktop UX
- Follows Playwright's best practice: "run the same tests in different configurations"

**CI/CD runs:**
- `test:e2e:desktop` (Chromium)
- `test:e2e:mobile` (Pixel 5)

This covers both viewports efficiently without running the full browser matrix (chromium, firefox, webkit, mobile) on every deploy.

- Future consideration: Full-file coverage could be achieved by aggregating E2E coverage into reports or adding lightweight component smoke tests for pages/App.

## App structure

- `src/pages/Home.vue` — Home screen with actions to generate horses and start racing.
- `src/pages/Race.vue` — Race screen with header, track, speed control, program, and results.
- `src/components` — UI components (e.g., `RaceTrack.vue`, `ProgramPanel.vue`, `ResultsPanel.vue`, `SpeedControl.vue`,
  `HorseList.vue`).
- `src/stores` — Pinia stores (`useRaceDataStore.ts`, `useUIControlStore.ts`, `useRaceAnimationStore.ts`).
- `src/composables` — Composables (`useRaceController.ts`, `useRaceSimulation.ts`).
- `src/utils` — Helper utilities (horse generation, ranking, schedule, random seeds, ordinals).
- `src/constants` — Game, UI, physics, and horse data.
- `src/types` — Centralized domain and state types.
- `e2e` — Playwright tests.

## Notes and tips

- Accessibility: tests prefer role‑based selectors (`getByRole`) and clear labels.
- The Speed control exposes `aria-expanded` for reliable expand/collapse assertions.
- During a race, speed presets are disabled by design; select them before starting.

## IDE setup

- VS Code with the Vue (Official) extension (disable Vetur).
- Install Vue DevTools for your browser.
