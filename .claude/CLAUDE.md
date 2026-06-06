# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

An Angular component library for [Keycloakify](https://www.keycloakify.dev/) — it provides pre-built Angular components for Keycloak login and account management themes. Consumers import these components and customize them by overriding CSS classes or replacing individual page components.

## Commands

```bash
yarn build           # Build the library via ng-packagr → dist/
yarn watch           # Watch mode: rebuild on change + apply RC version patch
yarn lint            # ESLint with auto-fix
yarn format          # Prettier write
yarn link-in-starter # Interactive CLI to link dist/ into a local starter project
yarn changelog       # Generate changelog (conventional-changelog)
```

There are no unit tests. Components are developed and tested via Storybook stories and by linking the library into starter projects.

## Architecture

### Entry Points & Exports

The library has two independently consumable modules:

- `@keycloakify/angular/login` — Keycloak login/registration pages (35+ pages)
- `@keycloakify/angular/account` — Keycloak account management pages (7 pages)
- `@keycloakify/angular/lib` — Shared utilities (pipes, directives, services)

The public API is defined in `src/index.ts`. Each module re-exports from its own `index.ts`.

### How Pages Are Loaded

The root template component (`src/login/template/template.component.ts` and `src/account/template/template.component.ts`) receives a `kcContext` input that contains the current Keycloak `pageId`. It dynamically instantiates the correct page component into a `ViewContainerRef` at runtime, injecting the appropriate DI tokens for that page's context, i18n, and CSS classes.

### Component Pattern

Every page component follows this structure:

```typescript
@Component({
    selector: 'kc-*',
    templateUrl: '*.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [...],
    providers: [
        { provide: ComponentReference, useExisting: forwardRef(() => MyComponent) }
    ]
})
export class MyComponent extends ComponentReference {
    kcContext = inject<Extract<KcContext, { pageId: 'page.ftl' }>>(KC_LOGIN_CONTEXT);
    i18n = inject<I18n>(LOGIN_I18N);
    override doUseDefaultCss = inject<boolean>(USE_DEFAULT_CSS);
    override classes = inject<Partial<Record<ClassKey, string>>>(LOGIN_CLASSES);
}
```

Key points:
- All components are **standalone** with `ChangeDetectionStrategy.OnPush`
- They **extend `ComponentReference`** (a base class holding `doUseDefaultCss` and `classes`)
- Context, i18n, and classes arrive via **DI tokens**, not `@Input()`
- State is managed with **signals** (`signal()`, `computed()`, `viewChild()`, `input()`)
- DI uses the `inject()` function pattern, not constructor injection

### DI Tokens

| Token | Purpose |
|---|---|
| `KC_LOGIN_CONTEXT` / `KC_ACCOUNT_CONTEXT` | Typed Keycloak context for the current page |
| `LOGIN_I18N` / `ACCOUNT_I18N` | Internationalization service |
| `LOGIN_CLASSES` / `ACCOUNT_CLASSES` | CSS class overrides from the consumer |
| `USE_DEFAULT_CSS` | Boolean — whether to apply keycloakify's default CSS |

### Shared Utilities (`src/lib/`)

- `KcClassDirective` — applies dynamic CSS class maps from the `classes` token
- `KcSanitizePipe` — sanitizes HTML/URL/script values for safe template binding
- `ToArrayPipe`, `InputTypePipe` — utility pipes
- `ScriptInjector` service — handles dynamic JS loading for pages that need it

## Code Conventions

- **Selector prefix:** `kc` (e.g., `kc-login`, `[kc-attribute]`)
- **ESLint:** Enforces type-only imports (`import type`), removes unused imports, Angular-specific rules
- **TypeScript path alias:** `@keycloakify/angular/*` → `./src/*`
- **Strict mode** enabled with `strictTemplates` and `strictInjectionParameters`

## Build Internals

`scripts/build.ts` runs `ng build` (ng-packagr) then post-processes the output to adjust entry points for modular exports. `scripts/watch.ts` does the same on file changes and additionally patches the version to an RC suffix for local development linking.

## Decision Protocol

When analysis reveals multiple valid implementation approaches, always stop and present the options clearly before writing any code. Wait for explicit confirmation of which approach to take. Never pick one unilaterally.


@AGENTS.md