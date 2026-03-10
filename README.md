# Ionic PoC

An Ionic / Angular **proof-of-concept** built with Angular 20.

> [!TIP]
> **TL;DR — Testing quickstart**
>
> ```bash
> npm run test:render
> npm run test:e2e:install
> npm run test:e2e
> ```
>
> Render tests validate component/page output quickly (`src/app/**/*.render.spec.ts`).
> E2E tests validate full user journeys in a real browser (`e2e/`).
> Full details: [Running tests](#running-tests).

## Table of contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Testing quickstart](#testing-quickstart)
- [Workspace conventions](#workspace-conventions)
- [How to run](#how-to-run)
- [How to build](#how-to-build)
- [Linting and formatting](#linting-and-formatting)
- [Styling](#styling)
- [Commit conventions](#commit-conventions)
- [Running tests](#running-tests)
- [HTTP auth interceptor](#http-auth-interceptor)
- [HTTP error interceptor](#http-error-interceptor)
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

## Testing quickstart

Use this short flow to run UI-focused tests locally:

```bash
# Render tests (Angular Testing Library + Karma/Jasmine)
npm run test:render

# Install Playwright browser once
npm run test:e2e:install

# E2E tests (Playwright)
npm run test:e2e
```

- Render tests live in `src/app/**/*.render.spec.ts` and validate component/page output quickly.
- E2E tests live in `e2e/` and validate full user journeys in a real browser.
- For detailed guidance and test strategy, see the [Running tests](#running-tests) section.

---

## Workspace conventions

- Use absolute imports with aliases:
  - `@app/*` → `src/app/*`
  - `@mocks/*` → `mocks/*`
  - `@env/*` → `src/environments/*`
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

# Run render tests (Angular Testing Library + Karma/Jasmine)
npm run test:render

# Install Playwright browser (first time only)
npm run test:e2e:install

# Run E2E tests (Playwright)
npm run test:e2e

# Run tests with coverage and save full output to test-log.log
npm run test:log

# Run tests with coverage directly via Angular CLI
ng test --no-watch --code-coverage
```

`npm run test:log` shows only a running status and final summary in the terminal.
Detailed test output is written to `test-log.log` at the project root (ignored by git).

### Render testing vs E2E testing

Both are required and they validate different risks.

#### Render testing

- **Goal:** Validate component/page rendering and UI states in isolation.
- **Tooling:** Angular Testing Library + Jasmine/Karma.
- **Location:** `src/app/**/*.render.spec.ts`.
- **Speed:** Fast, suitable for broad UI coverage.
- **Best for:**
  - translated labels,
  - conditional UI states (`loading`, `error`, `empty`),
  - component-level accessibility labels,
  - wiring of inputs/outputs and page composition.

Render tests do **not** replace full browser journey checks (routing transitions, real popovers, real app bootstrap timing).

#### E2E testing

- **Goal:** Validate real user flows in a real browser against a running app.
- **Tooling:** Playwright.
- **Location:** `e2e/**/*.spec.ts`, organized by domain/flow.
- **Speed:** Slower than render tests, higher confidence for integrations.
- **Best for:**
  - tab navigation and routing,
  - language switching flow,
  - end-to-end social feed rendering,
  - cross-component behaviors and lifecycle interactions.

### E2E file structure

E2E tests are centralized under `e2e/` and organized by behavior instead of component:

```text
e2e/
  smoke/
    app-shell.spec.ts
  flows/
    tabs-navigation.spec.ts
  i18n/
    language-switch.spec.ts
  social/
    social-feed.spec.ts
```

This keeps tests aligned with user journeys and avoids brittle, duplicated "one-file-per-component" E2E suites.

### CI for render + E2E

- Workflow: `.github/workflows/tests.yml`
- Runs on push/PR:
  1. `npm ci`
  2. `npm run test:render`
  3. `npm run test:e2e`
- Uploads Playwright artifacts:
  - `playwright-report`
  - `test-results/playwright`

### Playwright artifacts and debugging

`playwright.config.ts` is configured for CI-friendly diagnostics:

- HTML report output: `playwright-report/`
- Trace: `on-first-retry`
- Screenshot: `only-on-failure`
- Video: `retain-on-failure`
- Raw outputs: `test-results/playwright/`

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

## HTTP auth interceptor

Global auth header injection is implemented in:

- `src/app/core/auth-interceptor/auth.interceptor.ts`

It is registered in bootstrap via:

```typescript
provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor]));
```

### Behavior

- Function-based interceptor (`HttpInterceptorFn`).
- Adds `Authorization: Bearer <token>` when a token is available.
- Keeps an existing `Authorization` header unchanged.
- Resolves token source priority in this order:
  1. `sessionStorage`
  2. browser cookie
  3. development fake token (non-production only)

### Environment configuration

Auth parameters are configurable in both environment files:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: false,
  auth: {
    sessionStorageTokenKey: 'access_token',
    cookieTokenKey: 'access_token',
    developmentFakeToken: 'dev-fake-access-token',
  },
};
```

In production mode, the fake token is never used.

### Unit tests

Coverage for this behavior lives in:

- `src/app/core/auth-interceptor/auth.interceptor.spec.ts`

The spec validates:

- header injection from `sessionStorage`,
- cookie fallback when `sessionStorage` has no token,
- development fake-token fallback,
- no fake token in production,
- preserving pre-existing Authorization headers.

---

## HTTP error interceptor

Global API error handling is implemented in:

- `src/app/core/error-interceptor/api-error.interceptor.ts`

It is registered in bootstrap via `provideHttpClient(withInterceptors([apiErrorInterceptor]))` in `src/main.ts`.

### Behavior

- Retries transient failures with exponential backoff.
- Handles terminal request failures with an accessible Ionic toast (`ion-toast`).
- Logs detailed error data to `console.error` in development only.
- Supports per-request opt-out through `HttpContext`.

### Retry policy

The interceptor retries only transient errors:

- Network failures (`status === 0`)
- Server failures (`status >= 500`)

Backoff formula:

$$
delay = baseDelayMs \times 2^{(retryCount - 1)}
$$

With current defaults:

- Attempt 1 retry delay: `500ms`
- Attempt 2 retry delay: `1000ms`

After all retries are exhausted, the interceptor shows a translated toast and rethrows the original error.

### Environment configuration

Retry parameters are configurable in both environment files:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: false,
  apiErrorRetry: {
    maxAttempts: 2,
    baseDelayMs: 500,
  },
};
```

If values are missing or invalid, the interceptor falls back to safe defaults (`maxAttempts: 2`, `baseDelayMs: 500`).

### Opt-out with HttpContext

Use `IGNORE_API_ERROR_HANDLING` when a request should bypass retry, toast, and interceptor logging:

```typescript
import { HttpContext } from '@angular/common/http';
import { IGNORE_API_ERROR_HANDLING } from '@app/core/error-interceptor/api-error.interceptor';

const context = new HttpContext().set(IGNORE_API_ERROR_HANDLING, true);

this.http.get('/some/endpoint', { context });
```

### Toast and accessibility

On terminal errors, the interceptor creates a translated toast with:

- position: `top`
- color: `danger`
- dismiss action from i18n key `common.dismiss`
- accessibility attributes: `role="alert"`, `aria-live="assertive"`

Error message keys used:

- `errors.network`
- `errors.server`
- `errors.generic`

### Unit tests

Coverage for this behavior lives in:

- `src/app/core/error-interceptor/api-error.interceptor.spec.ts`

The spec validates:

- exponential backoff retry path,
- success after retry without showing toast,
- ignore-context bypass behavior,
- dev-only logging vs production behavior.

### Troubleshooting

When debugging a specific endpoint, use one of these approaches to reduce interceptor side effects:

- Bypass interceptor handling for one request with `HttpContext`:

```typescript
const context = new HttpContext().set(IGNORE_API_ERROR_HANDLING, true);
this.http.get('/debug/endpoint', { context });
```

- Temporarily disable retries by setting `apiErrorRetry.maxAttempts` to `0` in `src/environments/environment.ts`.
- Keep `production: false` locally to preserve console diagnostics from the interceptor.

If you still see repeated failures, verify whether the endpoint returns `status >= 500` or `status === 0`, because those conditions are intentionally retryable.

### Manual retry test (MSW)

Use this temporary handler to force a retryable failure:

```typescript
// mocks/handlers/posts.ts (temporary debug handler)
http.get(`${BASE}/debug/retry`, async () => {
  await delay(50);
  return new HttpResponse(null, { status: 503, statusText: 'Service Unavailable' });
});
```

Then call it from any component/service using `HttpClient`:

```typescript
this.http.get('/debug/retry').subscribe({
  next: () => {},
  error: () => {},
});
```

Expected result with current defaults (`maxAttempts: 2`, `baseDelayMs: 500`):

- initial request fails,
- retry after `500ms`,
- retry after `1000ms`,
- final error toast shown and error rethrown.

Remove the temporary handler after validation to avoid affecting other local flows.

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

In `src/app/core/auth-interceptor/auth.interceptor.ts`, replace the development/local token strategy with your real auth provider integration:

```typescript
// Replace this:
const token = sessionStorage.getItem('access_token');

// With your real token source, e.g. MSAL:
const token = await msalInstance.acquireTokenSilent(...);
// or Keycloak:
const token = keycloak.token;
```

Both changes are picked up automatically by all MFEs via the shared Angular DI tree — only the shell needs to be updated.
