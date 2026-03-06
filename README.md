# Ionic PoC

An Ionic / Angular **proof-of-concept** built with Angular 20.

## Table of contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Workspace conventions](#workspace-conventions)
- [How to run](#how-to-run)
- [How to build](#how-to-build)
- [Linting and formatting](#linting-and-formatting)
- [Styling](#styling)
- [Commit conventions](#commit-conventions)
- [Running tests](#running-tests)
- [API mocking with MSW](#api-mocking-with-msw)
- [Internationalization (i18n)](#internationalization-i18n)
- [Adapting for production](#adapting-for-production)

---

## Architecture

### Key design decisions

- Ionic 8 + Angular 20 with a single app under `src/`.
- Mock-first development via MSW handlers in `mocks/handlers`.
- Domain-oriented social media code split into `models/` and `services/`.
- Absolute import aliases for app and mocks (`@app/*`, `@mocks/*`).

### Project layout

```text
src/
  app/
    social-media/
      models/
      services/
mocks/
  handlers/
scripts/
```

---

## Prerequisites

```bash
node >= 22
npm  >= 11
```

If you use nvm, run:

```bash
nvm install 22
nvm use
```

> This project pins its package manager via `"packageManager": "npm@11.8.0"` in `package.json`.
> If you use [Corepack](https://nodejs.org/api/corepack.html), run `corepack enable` once so npm is
> automatically resolved to the pinned version on every `npm` invocation.

---

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/mergin/ionic-poc.git
cd ionic-poc

# 2. Install dependencies
#    The `prepare` script runs automatically and installs the Husky git hooks.
npm install
```

That's it — no additional setup steps are needed. The MSW Service Worker file lives under
`src/mockServiceWorker.js` (served at `/mockServiceWorker.js`), so you don't need to run
`npx msw init` manually.

---

## Workspace conventions

- Use absolute imports with aliases:
  - `@app/*` → `src/app/*`
  - `@mocks/*` → `mocks/*`
- API requests are mocked with MSW in development and tests.
- The social media mock API handlers are in `mocks/handlers/posts.ts`.
- Angular social media API models/services are in `src/app/social-media/models` and `src/app/social-media/services`.

---

## How to run

### All three apps in parallel (recommended)

```bash
npm run start
```

---

## How to build

```bash
# Full production build
npm run build
```

---

## Linting and formatting

### Commands

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `npm run lint`   | Lint all three projects sequentially (with `--fix`)   |
| `npm run format` | Format all `.ts`, `.html`, `.scss` files under `src/` |

### Linting

ESLint is configured in `eslint.config.mjs` (flat config) with three rule sets:

- **TypeScript** (`*.ts`) — `typescript-eslint` recommended rules, including `no-unused-vars`
- **Angular templates** (`*.html`) — `angular-eslint` template rules:
  - `prefer-self-closing-tags` — e.g. `<input />` not `<input>` _(error)_
  - `prefer-control-flow` — `@if`/`@for`/`@switch` only, no structural directives _(error)_
  - `eqeqeq` — `===`/`!==` only in template expressions _(error)_
  - `prefer-ngsrc` — prefer `ngSrc` over `src` on `<img>` elements _(warning)_
- **Prettier compatibility** — `eslint-config-prettier` disables any ESLint rules that would conflict with Prettier

All `lint:*` scripts run with `--fix`, so auto-fixable issues (self-closing tags, control flow migration) are corrected automatically.

### Formatting

Prettier is configured in `.prettierrc`. Key settings:

| Setting                  | Value                                             |
| ------------------------ | ------------------------------------------------- |
| `printWidth`             | `100`                                             |
| `tabWidth`               | `2` (spaces, never tabs)                          |
| `singleQuote`            | `true`                                            |
| `semi`                   | `true`                                            |
| `trailingComma`          | `"all"` (including function parameters)           |
| `arrowParens`            | `"avoid"` — `x => x`, not `(x) => x`              |
| `singleAttributePerLine` | `true` — one HTML attribute per line              |
| HTML parser              | `"angular"` — understands Angular template syntax |

### Pre-commit hook

[Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) run automatically on every `git commit`, processing only the staged files:

| Staged file     | Steps run                           |
| --------------- | ----------------------------------- |
| `src/**/*.ts`   | `eslint --fix` → `prettier --write` |
| `src/**/*.html` | `eslint --fix` → `prettier --write` |
| `src/**/*.scss` | `prettier --write`                  |

The hook is installed automatically via the `prepare` script when running `npm install` on a fresh clone.

---

## Styling

### Sass Import Syntax

Use modern `@use` syntax instead of deprecated `@import`:

```scss
// ✅ Correct: Modern @use syntax
@use '../../../styles/utilities' as utilities;
@use './mixins' as mixins;

// ❌ Avoid: Deprecated @import syntax
@import '../../../styles/utilities';
```

When using `@use`, access namespace members with the dot notation (e.g., `utilities.$breakpoints`, `mixins.flex-center`).

### CSS Variables vs SCSS Variables

**Use CSS custom properties (CSS variables) by default** — they are available at runtime, can be overridden dynamically, and work directly in templates.

---

## Commit conventions

Commit messages are enforced by [commitlint](https://commitlint.js.org/) using the [`@commitlint/config-angular`](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular) preset. The hook runs automatically via Husky on every `git commit`.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type       | When to use                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | A new feature                                   |
| `fix`      | A bug fix                                       |
| `docs`     | Documentation changes only                      |
| `style`    | Formatting, whitespace — no logic change        |
| `refactor` | Code change that is neither a fix nor a feature |
| `perf`     | Performance improvement                         |
| `test`     | Adding or updating tests                        |
| `build`    | Build process, tooling, dependency updates      |
| `ci`       | CI/CD configuration changes                     |
| `revert`   | Reverts a previous commit                       |

### Scopes

Scopes are optional but recommended. Allowed values are restricted to this monorepo's projects and shared concerns:

| Scope     | What it covers                                  |
| --------- | ----------------------------------------------- |
| `app`     | `app/` — features code                          |
| `mocks`   | `mocks/` — shared MSW handlers and fixture data |
| `deps`    | Dependency updates                              |
| `ci`      | CI/CD pipeline                                  |
| `release` | Version bumps / changelogs                      |

### Rules

- **Subject** must be lowercase and must not end with a period
- **Subject** must not be empty
- **Type** must be one of the values listed above
- **Scope** must be one of the values listed above (when provided)
- **Header** (type + scope + subject) must not exceed **100 characters**

### Examples

```bash
# Valid
feat(customers): add search filter to customer list
fix(accounts): correct balance rounding on detail page
test(shell): add router-outlet assertion to app spec
build(deps): upgrade angular to 21.2.0
docs: update README with commit conventions
refactor(accounts): extract balance formatter to shared pipe
ci: add lint step to github actions workflow

# Invalid — rejected by commitlint
qwe                              # no type
added search filter              # no type
feat: Added search filter        # subject must be lowercase
feat(payments): add filter       # unknown scope
fix(accounts): correct balance.  # subject must not end with a period
chore(deps): bump typescript     # `chore` is not a valid type — use `build`
```

---

## Running tests

### Commands

```bash
# Run all tests once (no watch mode)
npm test

# Run tests with coverage and save full output to test-log.log
npm run test:log

# Run tests with coverage directly via Angular CLI
ng test --no-watch --code-coverage
```

`npm run test:log` shows only a running status and final summary in the terminal.
Detailed test output is written to `test-log.log` at the project root (ignored by git).

### Testing conventions

Common patterns across all projects:

- Specs follow Jasmine + Karma with Angular `TestBed`.
- HTTP services are tested with `provideHttpClient()` + `provideHttpClientTesting()` and
  `HttpTestingController`.
- Components can inject spy classes (for example, `*.service.spy.ts`) to keep tests focused.
- Tests follow the `// ARRANGE` / `// ACT` / `// ASSERT` structure and add a
  `// CLEANUP` section when teardown is required.

### Test stack

- **Runner**: Karma + Jasmine (`ng test`)
- **HTTP mocking**: `HttpTestingController` for service-level HTTP assertions
- **Mock data**: social media fixtures in `mocks/db.ts` (`socialPostsDb`)
- **Globals**: Jasmine globals (`describe`, `it`, `expect`, etc.)

> **Note:** Browser MSW is started in `src/test.ts`. Keep unit tests deterministic by mocking services or HTTP calls where needed.

---

## API mocking with MSW

[Mock Service Worker (MSW)](https://mswjs.io/) is used to intercept HTTP requests in the browser during local development, so the apps can run fully without a real backend.

### How it works

MSW uses a browser **Service Worker** to intercept `fetch` requests at network level.
In this project, the worker is started from Angular bootstrap in development and test bootstrap.

```
Bootstrap
  └── src/main.ts (dev)
    └── import '@mocks/browser'
              └── setupWorker(...handlers)   ← MSW Service Worker
        └── worker.start()       ← /mockServiceWorker.js

Tests
  └── src/test.ts
    └── import '@mocks/browser'
      └── worker.start() / worker.stop()
```

### File layout

The relevant files are:

- `mocks/browser.ts` — `setupWorker` + `worker.start({ onUnhandledRequest: 'bypass' })`
- `mocks/handlers/posts.ts` — social media API handlers
- `mocks/handlers/index.ts` — handler barrel exports
- `mocks/db.ts` — typed mock fixture data (`socialPostsDb`)
- `src/mockServiceWorker.js` — worker script served at `/mockServiceWorker.js`
- `src/main.ts` and `src/test.ts` — worker startup wiring

### Mock data (`mocks/db.ts`)

`mocks/db.ts` contains the typed post fixtures used by handlers.

### Handlers (`mocks/handlers/`)

All handlers simulate realistic network latency via MSW's `delay()` helper.

| Method | URL                       | Response                                                     | Delay  |
| ------ | ------------------------- | ------------------------------------------------------------ | ------ |
| `GET`  | `/social/posts`           | post list (newest first, engagement randomized per response) | 300 ms |
| `GET`  | `/social/posts/:id`       | single post by id                                            | 200 ms |
| `POST` | `/social/posts/:id/likes` | liked post payload                                           | 150 ms |

The base URL matches the `API_BASE_URL` token value: `https://api-gateway.example.com/v1`.

### Activating the mocks

MSW is enabled in non-production app bootstrap and in test bootstrap.

```typescript
if (!environment.production) {
  const { startMockWorker } = await import('@mocks/browser');
  await startMockWorker();
}
```

`onUnhandledRequest: 'bypass'` means any request that does not match a handler (e.g. federation `remoteEntry.json` fetches) passes through to the network unchanged.

To **disable** the mocks while keeping `ng serve` running, open DevTools and unregister the Service Worker under **Application → Service Workers**.

### Adding a new handler

1. Add your fixture records to `mocks/db.ts`.
2. Add a handler to the relevant file in `mocks/handlers/` (or create a new one).
3. Export the handler from `mocks/handlers/index.ts`.

```typescript
// mocks/handlers/posts.ts
http.get(`${BASE}/social/posts/:id`, async ({ params }) => {
  await delay(200);
  return HttpResponse.json(socialPostsDb.find(p => p.id === params['id']));
}),
```

### MSW and unit tests

Browser MSW is started in Karma tests through `src/test.ts`. Keep unit tests deterministic by mocking services or HTTP calls where needed.

---

## Internationalization (i18n)

Translations are handled by [`@ngx-translate/core`](https://github.com/ngx-translate/core) v17
with [`@ngx-translate/http-loader`](https://github.com/ngx-translate/http-loader) v17.

### How it works

```
Bootstrap (shell)
  └── src/main.ts
        ├── provideTranslateService({ lang: 'en', fallbackLang: 'en' })
        │     └── triggers translate.use('en') at bootstrap
        │           └── HTTP GET /assets/i18n/en.json  ← loaded once, cached for the session
        └── provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' })
```

`TranslateService` is provided **once in the shell** and shared as a singleton with all MFEs via
Angular's DI tree. Each MFE's `app.config.ts` calls `provideChildTranslateService({ extend: true })`
— this wires the MFE into the shell's existing service without creating a new instance or firing
another network request.

Templates use the `TranslatePipe` to render keys:

```html
<h2>{{ 'customers.list.title' | translate }}</h2>
```

### Translation files

All translation files live under **`src/assets/i18n/`** — they are served as static
assets by the shell and loaded at runtime via HTTP.

| File                      | Language |
| ------------------------- | -------- |
| `src/assets/i18n/en.json` | English  |
| `src/assets/i18n/es.json` | Spanish  |

### i18n quick checklist

- Keep global provider wiring in `src/main.ts` with `provideTranslateService(...)` and `provideTranslateHttpLoader(...)`.
- Keep English as default and fallback (`lang: 'en'`, `fallbackLang: 'en'`) unless requirements say otherwise.
- Add every new user-facing literal as a translation key in both `en.json` and `es.json`.
- Prefer `{{ 'key.path' | translate }}` in templates over hardcoded UI strings.
- For specs that render translated templates, provide `provideTranslateService()` in `TestBed`.

### Adding a new language

1. Create `src/assets/i18n/<locale>.json` with the same key structure as `en.json`.
2. Switch the active language at runtime:

```typescript
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const translate = inject(TranslateService);
translate.use('fr'); // triggers GET /assets/i18n/fr.json on first call
```

The loader caches each locale after the first load — subsequent `use('fr')` calls do not fire a
new request.

### Translations in unit tests

No HTTP loader is registered in the test environment. `TranslatePipe` therefore returns the raw
translation key as-is (e.g. `customers.list.title`). All spec files provide the service without a
loader:

```typescript
// In setup() — no loader, no HTTP request for translations
provideTranslateService(),
```

DOM assertions target the raw key rather than the English string:

```typescript
// ✅ correct — matches what the pipe returns in tests
expect(el.querySelector('.error')?.textContent).toContain('customers.list.error');

// ❌ wrong — the English string is never rendered in the test environment
expect(el.querySelector('.error')?.textContent).toContain('Failed to load');
```

---

## Adapting for production

This POC ships with two stubs that must be replaced before real deployment:

### 1. API base URL

In `src/app/app.config.ts`, replace the hardcoded mock URL with your real gateway:

```typescript
{ provide: API_BASE_URL, useValue: 'https://your-real-gateway.example.com/v1' }
```

Or read it from an environment variable / Angular build-time token as required by your infrastructure.

### 2. Auth token source

In `src/app/core/auth.interceptor.ts`, replace the `sessionStorage` stub:

```typescript
// Replace this:
const token = sessionStorage.getItem('access_token');

// With your real token source, e.g. MSAL:
const token = await msalInstance.acquireTokenSilent(...);
// or Keycloak:
const token = keycloak.token;
```

Both changes are picked up automatically by all MFEs via the shared Angular DI tree — only the shell needs to be updated.
