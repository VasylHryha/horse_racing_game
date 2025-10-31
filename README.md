# Horse Racing Simulator

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
- Run all: `npm run test:e2e`
- Chromium only: `npm run test:e2e -- --project=chromium`
- Single file: `npm run test:e2e -- e2e/raceFlow.spec.ts`
- Debug mode: `npm run test:e2e -- --debug`

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
