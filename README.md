# Ionic PoC

An Ionic / Angular **proof-of-concept** built with Angular 20.

## Table of contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
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

         |

### Project layout

## Prerequisites

```bash
node >= 22
npm  >= 11
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

That's it — no additional setup steps are needed. MSW Service Worker files are already committed to
each project's `public/` folder, so you don't need to run `npx msw init` manually.

---

## How to run

### All three apps in parallel (recommended)

```bash
npm run start
```

## How to build

````bash
# Full production build
npm run build


## Server-side rendering (SSR)

All three applications are configured for Angular SSR via `@angular/ssr`. SSR is enabled automatically
in production builds — no extra flags are needed.


## Linting and formatting

### Commands

| Command                      | What it does                                               |
| ---------------------------- | ---------------------------------------------------------- |
| `npm run lint`               | Lint all three projects sequentially (with `--fix`)        |
| `npm run format`             | Format all `.ts`, `.html`, `.scss` files under `src/` |

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

| Staged file          | Steps run                           |
| -------------------- | ----------------------------------- |
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
````

When using `@use`, access namespace members with the dot notation (e.g., `utilities.$breakpoints`, `mixins.flex-center`).

### CSS Variables vs SCSS Variables

**Use CSS custom properties (CSS variables) by default** — they are available at runtime, can be overridden dynamically, and work directly in templates.

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

### Testing conventions

Common patterns across all projects:

### Commands

### Quick run

```bash
# Run all tests once (no watch mode)
npm test

# Run all tests + coverage, save results to test-result.log
npm run test:log
```

### What is tested

                                                                                                                                 |

### Testing conventions

Common patterns across all projects:

- Each `describe` block defines an `async function setup(...)` factory returning
  `{ fixture, controller, ... }` to simplify reuse.
- Providers always include `provideZonelessChangeDetection()` and pairing
  `provideHttpClient(withFetch())` with `provideHttpClientTesting()`.
- Components that use router directives call `provideRouter([])`.
- When HTTP dependencies are injected, tests prefer a spy (`<Service>Spy`) rather
  than exercising `HttpTestingController` directly.
- Tests follow the `// ARRANGE` / `// ACT` / `// ASSERT` structure and add a
  `// CLEANUP` section for any flushes needed solely to satisfy `controller.verify()`.
- Required `input()` values are set via `fixture.componentRef.setInput(...)` inside
  the setup factory before returning.

### Test stack

- **Runner**: Vitest 4 (managed by `@angular/build:unit-test`, jsdom environment)
- **HTTP mocking**: `HttpTestingController` — no network calls, no running servers needed
- **Mock data**: shared fixture in `mocks/db.ts` (`customersDb`, `accountsDb`)
- **Globals**: `describe`/`it`/`expect`/`beforeAll` etc. are available globally via `"types": ["vitest/globals"]` in `tsconfig.spec.json`

> **Note:** `msw/node` (Service Worker mocking) is intentionally **not** used in unit tests — importing it causes the `@angular/build:unit-test` Vitest runner to hang. MSW is wired for browser-only use (`mocks/handlers/`) and is available for future integration/e2e tests.

---

### Coverage report (`npm run test:log`)

Running `npm run test:log` executes `scripts/test-log.sh`, which:

1. Runs each project with `--coverage`
2. Prints live feedback in the terminal as each suite completes
3. Prints a consolidated coverage summary table at the end
4. Writes a full human-readable report to **`test-result.log`** in the project root

#### Terminal output (example)

#### `test-result.log` structure

The log file is overwritten on every run and contains three sections per project:

> `test-result.log` is listed in `.gitignore` — it is a local artefact and is not committed.

---

## API mocking with MSW

[Mock Service Worker (MSW)](https://mswjs.io/) is used to intercept HTTP requests in the browser during local development, so the apps can run fully without a real backend.

### How it works

MSW uses a **Service Worker** registered in each app's `public/` folder to intercept `fetch` requests at the network level. The worker is started automatically at bootstrap **only on `localhost`** — it is a no-op in production builds.

```
Bootstrap (localhost only)
  └── bootstrap.ts
        └── import './mocks/browser'
              └── setupWorker(...handlers)   ← MSW Service Worker
                    └── worker.start()       ← registered in <project>/public/mockServiceWorker.js
```

### File layout

See the [Project layout](#project-layout) tree above. The relevant files are:

- `mocks/` — shared fixture data and handlers (workspace root)
- `src/mocks/browser.ts` — per-app Service Worker setup

The shell aggregates **both** handler sets so a single worker intercepts every API call regardless of which MFE originated it. Each standalone MFE registers only its own handlers for independent `ng serve`.

### Mock data (`mocks/db.ts`)

Types are defined inline in `db.ts` (not imported from MFE source) to avoid cross-project TypeScript compilation boundaries.

### Handlers (`mocks/handlers/`)

All handlers simulate realistic network latency via MSW's `delay()` helper.

| Method | URL                 | Response | Delay  |
| ------ | ------------------- | -------- | ------ |
| `GET`  | `             `     |          | 400 ms |
| `GET`  | `                 ` |          | 300 ms |
| `GET`  | `            `      |          | 400 ms |
| `GET`  | `                `  |          | 300 ms |

The base URL matches the `API_BASE_URL` token value: `https://api-gateway.example.com/v1`.

### Activating the mocks

MSW is **active by default on `localhost`** — no flags or environment variables needed. The check in `bootstrap.ts` is:

```typescript
if (typeof window !== 'undefined' && location.hostname === 'localhost') {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}
```

`onUnhandledRequest: 'bypass'` means any request that does not match a handler (e.g. federation `remoteEntry.json` fetches) passes through to the network unchanged.

To **disable** the mocks while keeping `ng serve` running, open DevTools and unregister the Service Worker under **Application → Service Workers**.

### Adding a new handler

1. Add your fixture records to `mocks/db.ts`.
2. Add a handler to the relevant file in `mocks/handlers/` (or create a new one).
3. Register the handler in the appropriate `browser.ts` files.

```typescript
// mocks/handlers/customers.ts
http.get(`${BASE}/customers/:id/orders`, async ({ params }) => {
  await delay(200);
  return HttpResponse.json(ordersDb.filter(o => o.customerId === params['id']));
}),
```

### MSW and unit tests

MSW's **`msw/node`** (`mocks/server.ts`) is **not used in unit tests**. Importing it causes the `@angular/build:unit-test` Vitest runner to hang indefinitely due to Node HTTP patching conflicts. Unit tests use Angular's `HttpTestingController` instead.

`mocks/server.ts` is kept for use in future **integration or e2e** test suites that run outside the Angular test builder (e.g. Playwright, or a plain Vitest config targeting Node).

---

## Internationalization (i18n)

Translations are handled by [`@ngx-translate/core`](https://github.com/ngx-translate/core) v17
with [`@ngx-translate/http-loader`](https://github.com/ngx-translate/http-loader) v17.

### How it works

```
Bootstrap (shell)
  └── app.config.ts
        ├── provideTranslateService({ lang: 'en', defaultLanguage: 'en' })
        │     └── triggers translate.use('en') at bootstrap
        │           └── HTTP GET /i18n/en.json  ← loaded once, cached for the session
        └── provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' })
```

`TranslateService` is provided **once in the shell** and shared as a singleton with all MFEs via
Angular's DI tree. Each MFE's `app.config.ts` calls `provideChildTranslateService({ extend: true })`
— this wires the MFE into the shell's existing service without creating a new instance or firing
another network request.

Templates use the `TranslatePipe` to render keys:

```html
<!-- static key -->
```

### Translation files

All translation files live under **`src/public/i18n/`** — they are served as static
assets by the shell and loaded at runtime via HTTP.

| File                      | Language |
| ------------------------- | -------- |
| `src/public/i18n/en.json` | English  |

#### Key structure (`en.json`)

### Adding a new language

1. Create `src/public/i18n/<locale>.json` with the same key structure as `en.json`.
2. Switch the active language at runtime:

```typescript
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const translate = inject(TranslateService);
translate.use('fr'); // triggers GET /i18n/fr.json on first call
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
