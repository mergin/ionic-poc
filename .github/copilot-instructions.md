You are an expert in TypeScript, Angular 20, and Ionic 8 application development.
Write functional, maintainable, performant, and accessible code aligned with this
workspace conventions.

## Project Context

- Stack: Ionic 8 + Angular 20 + TypeScript 5 + RxJS 7.
- App structure lives under `src/` (not `projects/`).
- Unit tests run with Jasmine + Karma.
- Linting uses Angular ESLint + ESLint 9 (`npm run lint`).
- Use absolute imports with aliases only:
  - `@app/*` for `src/app/*`
  - `@mocks/*` for `mocks/*`
- This project uses MSW for API mocking in development and tests.
- Mock API handlers live in `mocks/handlers` and should model real API contracts.
- Social media domain code lives in `src/app/social-media` with:
  - `models/` for interfaces/types
  - `services/` for Angular API services
  - `index.ts` barrel exports in each folder

## TypeScript Best Practices

- Use strict typing and prefer explicit domain types.
- Prefer type inference when obvious, but avoid ambiguous inferred types.
- Avoid `any`; use `unknown` when the type is uncertain.
- Keep functions small and pure when possible.

## Angular 20 + Ionic 8 Best Practices

- Use standalone components and lazy-loaded routes.
- Do NOT set `standalone: true` in decorators (Angular 20 default).
- Prefer `inject()` over constructor injection where it improves readability.
- Use signals (`signal`, `computed`) for local component state.
- Do not use `@HostBinding` / `@HostListener`; define host metadata in the `host` object.
- Prefer `ChangeDetectionStrategy.OnPush` for components.
- Keep Ionic pages/components focused and small.

## Template Guidelines

- Use Angular control flow (`@if`, `@for`, `@switch`) instead of structural directives.
- Keep template expressions simple; move non-trivial logic to TypeScript.
- Use `class` and `style` bindings instead of `ngClass` and `ngStyle`.
- Use `ngSrc` (`NgOptimizedImage`) for static image resources when applicable.
- Avoid arrow functions and complex inline transformations in templates.

## Services

- Keep services single-responsibility and provide them with `providedIn: 'root'`.
- Prefer observable-returning APIs for async data (`Observable<T>`).
- Keep transport mapping and error handling inside services, not components.
- Add concise JSDoc for public service methods.
- Every service must live in its own folder under the domain `services/` directory.
- Each service folder must contain:
  - `<name>.service.ts`
  - `<name>.service.spec.ts`
  - `<name>.service.spy.ts`
- Every `<name>.service.spy.ts` must expose spies for all public methods of that service.

## MSW Mocking

- Keep the browser worker setup in `mocks/browser.ts` and initialize it from app/test bootstrap.
- Keep endpoint handlers grouped by domain in `mocks/handlers` and export them through `mocks/handlers/index.ts`.
- Ensure mocked endpoints cover all service methods for each domain API.

## Code Style — Prettier

- Follow `.prettierrc` strictly (2 spaces, single quotes, semicolons, trailing commas).
- Run `npm run format` for code under `src/**/*.{ts,html,scss}`.

## Code Style — ESLint

- All generated code must pass `npm run lint`.
- Remove unused imports/variables immediately.
- For templates, follow Angular ESLint rules (control flow, `ngSrc`, strict equality).
- Do not add formatting rules that conflict with Prettier.

## Styling — SCSS

- Prefer existing Ionic/theming tokens from `src/theme/variables.scss`.
- Put cross-app styles in `src/global.scss`; keep page styles scoped to each component.
- Reuse Ionic utility classes and CSS variables before creating new custom rules.
- Avoid hard-coded colors when a theme variable exists.

## Unit Testing (AAA Required)

### Framework & Runner

- Use Jasmine + Karma with Angular `TestBed`.
- Place specs next to implementation files (`*.spec.ts`).

### AAA Pattern (Mandatory)

- Every test must be structured with explicit comments:
  - `// ARRANGE`
  - `// ACT`
  - `// ASSERT`
- Keep one behavioral assertion goal per test when practical.
- If cleanup is required (timers/subscriptions/manual teardown), add:
  - `// CLEANUP`

### TestBed Setup

- Configure standalone components via `imports` in `TestBed.configureTestingModule`.
- Mock dependencies with Jasmine spies (`jasmine.createSpyObj`) or lightweight stubs.
- Keep setup minimal and focused on behavior under test.

### Async and HTTP Testing

- Prefer `fakeAsync` + `tick` for deterministic async behavior.
- When testing HTTP services, use `HttpClientTestingModule` + `HttpTestingController`.
- Verify pending requests in `afterEach` with `httpMock.verify()`.

### Minimum Coverage for New Component Specs

- Component creation.
- Main happy path render/behavior.
- One error or empty-state behavior when relevant.
- Interaction/event behavior for user-triggered actions.

## Documentation

- Add brief JSDoc to public classes and public methods in services/components.
- Keep documentation concise and behavior-oriented.
