# Changelog

All notable changes to this project will be documented in this file.

## [2026-11-13] — Hand-written changelog

**Type:** chore

### Changes

- **Changelog rewritten by hand**: one readable entry per stable release (v0.0.1 → v22.1.0), rebuilt from commits and
  diffs, instead of the single conventional-changelog block listing every commit.
- **No more regeneration at release time**: `release.sh` used to delete `CHANGELOG.md` and rebuild it with
  conventional-changelog, which would have overwritten the hand-written entries. Stable releases now only stamp a
  version delimiter above the new entries through `scripts/stamp-changelog.sh` (idempotent, same script as
  angular-email). The `changelog` script and the `conventional-changelog*` dev dependencies are removed.
- `changelog-update` skill documents entry format, ordering and delimiters.
- Verified: stamping a fake v22.1.1 puts the delimiter above the topmost entry, a second run is a no-op.

### Files modified

- `CHANGELOG.md` — rewritten
- `scripts/stamp-changelog.sh` (new) — version delimiter
- `scripts/release.sh` — stamps the changelog on stable releases instead of regenerating it
- `package.json`, `pnpm-lock.yaml` — `changelog` script and `conventional-changelog*` removed
- `.claude/skills/changelog-update/SKILL.md` (new), `.claude/CLAUDE.md`, `.claude/AGENTS.md` — changelog rules

## [2026-11-13] — Template diagnostics cleanup

**Type:** chore

### Changes

- **No more build warnings**: Angular's extended diagnostics reported 11 warnings (NG8102, NG8107, NG8112). The
  redundant `?.` / `??` operators are removed where the type is already narrowed or non-nullable: social providers
  grid in `login` and `login-username` (inside the `@if` that checks them, as in keycloakify's `Login.tsx`),
  `realm.displayNameHtml` in the login template header, `kcContext.applications` in the account `applications` page.
  Rendering is unchanged.
- **`UserProfileFormFieldsComponent.xAttributeLocale$` removed**, together with its unused `@let`: the hidden `locale`
  input that read it was dropped in v0.2.23 (port of keycloakify `fa5814ac`). Only custom templates that still
  reference it are affected.
- Verified: `pnpm build` with zero warnings, `ng lint`.

### Files modified

- `src/login/pages/login/login.component.html`, `src/login/pages/login-username/login-username.component.html`
- `src/login/template/template.component.html`
- `src/account/pages/applications/applications.component.html`
- `src/login/components/user-profile-form-fields/user-profile-form-fields.component.{ts,html}`

## [2026-11-13] — keycloakify 11.16 password policies

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify/pull/1071

### Changes

- keycloakify 11.16.4 adds `passwordHistory` and `forceExpiredPasswordChange` to `PasswordPolicies` (exposed by
  Keycloak 26+) and excludes them from `FormFieldError.Source.PasswordPolicy['name']`, since they can't be validated
  client side (they need the stored credentials). The Angular `FormFieldError` type mirrors the change (port of
  keycloakify `bfaf6b60`): without it the type equality checks against keycloakify's `getUserProfileApi` failed and the
  library didn't build. Peer dependency range unchanged.
- The other keycloakify 11.16.1 → 11.16.4 changes (custom handler resolution, `termsTitle` forwarding,
  `application.client` in the account `applications.ftl` context) live in the CLI and the FTL templates: nothing to
  port.

### Files modified

- `src/login/services/user-profile-form/user-profile-form.service.ts` — `FormFieldError.Source.PasswordPolicy`

## [2026-11-13] — Migrate to pnpm, dependency update

**Type:** chore

### Changes

- **pnpm 12.18** replaces yarn: `packageManager` field, `pnpm-lock.yaml` imported from `yarn.lock`, `yarn.lock`
  removed. `pnpm-workspace.yaml`: the `tmp` resolution becomes an override; `allowBuilds` runs only esbuild's
  postinstall — `@parcel/watcher`, `lmdb` and `msgpackr-extract` only compile from source when no prebuilt binary is
  available.
- `tsafe` declared as a development dependency: the sources import it and the published package already depends on
  it (`src/package.json`), but under yarn it was only reachable through keycloakify's hoisted copy. pnpm's strict
  layout made the missing declaration a build error.
- Scripts run through pnpm (`build`, `watch`, esbuild bundling of the CLI, `release`, husky `pre-commit`).
- **Linking into a starter** (`pnpm link-in-starter`) now writes `link:` overrides into the starter's
  `pnpm-workspace.yaml` instead of using `yarn link` with an isolated `.yarn_home`. Overrides also apply to transitive
  dependencies, so Angular, keycloakify, rxjs, tslib and typescript stay single copies (e.g. the `@angular/core`
  required by `@angular/router`), and the starter's `package.json` is left untouched. The starter must use pnpm; the
  overrides and the lockfile changes must not be committed (the script prints how to undo them).
- CI installs with `pnpm/action-setup` + `pnpm install --frozen-lockfile`; publishing still uses `npm publish`
  (OIDC trusted publishing).
- **Format check now real**: `npm run _format --list-different` never forwarded the flag to prettier, so the CI check
  always passed. pnpm forwards it (no file was out of format).
- Development dependencies: Angular 22.2.6 / CLI-build 22.2.7, keycloakify 11.16.4, ng-packagr 22.2.6, Storybook 10.6,
  eslint 10.14, prettier 3.10, chokidar 6, all-contributors-cli 7, `@types/node` 26. Development Node version moved
  to `lts/lithium` (26). Library peer and runtime dependency ranges are unchanged.
- Verified: `pnpm install --frozen-lockfile`, `pnpm build`, `ng lint`, `pnpm _format --list-different`,
  `link-in-app.ts` against a pnpm copy of the Vite starter (every Angular package resolves the same `@angular/core`).

### Files modified

- `package.json`, `pnpm-workspace.yaml` (new), `pnpm-lock.yaml` (new), `yarn.lock` (removed)
- `.nvmrc` — `lts/lithium`
- `.github/workflows/ci.yaml` — pnpm setup and install
- `scripts/build.ts`, `scripts/watch.ts`, `scripts/shared/postNgBuild.ts`, `scripts/release.sh` — pnpm commands
- `scripts/link-in-starter.ts`, `scripts/link-in-app.ts` — linking through pnpm overrides
- `.husky/pre-commit` — pnpm commands
- `.gitignore`, `.prettierignore` — yarn entries removed
- `README.md`, `.claude/CLAUDE.md` — pnpm commands

**═══════════════════ v22.1.0 — released 2026-09-01 ═══════════════════**

## [2026-09-01] — select-organization page, passkey conditional UI, TemplateSlots

**Type:** feat

### Changes

- **New `select-organization.ftl` page** (`@keycloakify/angular/login/pages/select-organization`,
  `SelectOrganizationComponent`, selector `kc-select-organization`), wired into `getDefaultPageComponent`. It lists
  `kcContext.user.organizations` as buttons (grid layout above 3 entries, reusing the `kcFormSocialAccount*` classes)
  and submits the chosen alias as `kc.org`. Ported from the upstream keycloakify React implementation.
- **Passkey conditional UI on `login-username.ftl` and `login-password.ftl`**: when
  `kcContext.enableWebAuthnConditionalUI` is set, the pages render the hidden `webauth` / `authn_select` forms and a
  "passkey-doAuthenticate" button, inject Keycloak's `webauthnAuthenticate.js` / `passkeysConditionalAuth.js`, and the
  username input gets `autocomplete="username webauthn"`. On `login-password` the unused `authButtonId` property is
  replaced by `webAuthnButtonId`.
- **Fix `login-passkeys-conditional-authenticate.ftl`**: the authenticate button had the literal id `authButtonId`
  instead of the bound value, so the injected script could not find it; the injected script also reused the
  `LoginRecoveryAuthnCodeConfig` id and now has its own.
- **New `TemplateSlots` interface** (`@keycloakify/angular/login/classes/template-slots`) describing what a page can
  expose to the template (`displayInfo`, `displayMessage`, `displayRequiredFields`, `documentTitle`, `bodyClassName`,
  `headerNode`, `infoNode`, `socialProvidersNode`). All login pages now `implements TemplateSlots` and the login
  `TemplateComponent` uses it instead of untyped casts; custom pages can implement it for type checking.
- `getDefaultPageComponent` (login and account) now has an exhaustive `pageId` check, so a page id added to
  keycloakify but missing here fails at compile time. Dependencies: Angular 22.1, keycloakify 11.16.0 (peer ranges
  unchanged).

**═══════════════════ v22.0.1 — released 2026-06-18 ═══════════════════**

## [2026-06-18] — Dependency update

**Type:** chore

### Changes

- Dependency update only: Angular 22.0.2, keycloakify 11.15.9 (dev). No library code changes.

**═══════════════════ v22.0.0 — released 2026-06-18 ═══════════════════**

## [2026-06-18] — Angular 22

**Type:** chore (breaking)

### Changes

- **Peer dependencies moved to Angular 22** (`@angular/core`, `@angular/common`, `@angular/platform-browser`
  `^22.0.0`) and **keycloakify `^11.15.3`**; `tsafe` runtime dependency raised to `^1.8.12`.
- The CLI binary (eject-page, initialize-account-theme) is now bundled with esbuild into a single ESM
  `bin/index.js` instead of `@vercel/ncc`; the bin TypeScript sources are no longer copied into the published package.
  Prettier stays external so the consumer project's version is used.
- The account theme boilerplate `KcPageStory` generated by `initialize-account-theme` now uses `OnPush` change
  detection.
- Internals: TypeScript 6.0, ng-packagr 22, all-contributors setup.

**═══════════════════ v21.1.5 — released 2026-06-06 ═══════════════════**

## [2026-06-06] — Dependency update

**Type:** chore

### Changes

- Dependency update only (Storybook 10.4, ESLint 10.4). No library code changes.

**═══════════════════ v21.1.4 — released 2026-05-11 ═══════════════════**

## [2026-05-11] — Storybook story

**Type:** chore

### Changes

- Adds a Storybook story for `select-organization.ftl`. No library code changes.

**═══════════════════ v21.1.3 — released 2026-05-11 ═══════════════════**

## [2026-05-11] — eject-page messages

**Type:** bugfix

### Changes

- `eject-page`: when `KcPage.ts` / `KcPageStory.ts` need no change it now prints a yellow "No changes for file …,
  ignoring." notice instead of the misleading "Unable to automatically update" error; that error is now shown only
  when writing the file actually fails, and includes the underlying error message.
- Dependencies: Angular 21.2.12.

**═══════════════════ v21.1.2 — released 2026-04-13 ═══════════════════**

## [2026-04-13] — link-idp-action header

**Type:** bugfix

### Changes

- `link-idp-action.ftl`: the header template now declares its own `@let idpDisplayName`, so the IdP name is resolved
  inside the `headerNode` template rendered by the template component.

**═══════════════════ v21.1.1 — released 2026-04-13 ═══════════════════**

## [2026-04-13] — link-idp-action default page

**Type:** bugfix

### Changes

- `getDefaultPageComponent` was missing the `link-idp-action.ftl` case added in 21.1.0, so the default page threw
  "FTL page not found"; it now loads `LinkIdpActionComponent`.

**═══════════════════ v21.1.0 — released 2026-04-13 ═══════════════════**

## [2026-04-13] — link-idp-action page

**Type:** feat
**Ref:** https://github.com/keycloakify/keycloakify-angular/issues/49

### Changes

- **New `link-idp-action.ftl` page** (`@keycloakify/angular/login/pages/link-idp-action`, `LinkIdpActionComponent`,
  selector `kc-link-idp-action`): shows `linkIdpActionTitle` / `linkIdpActionMessage` for the IdP and offers
  Continue / Cancel (`cancel-aia`) buttons.
- Storybook: the account `federatedIdentity` story file renamed to match the page id
  ([#48](https://github.com/keycloakify/keycloakify-angular/issues/48)).

**═══════════════════ v21.0.6 — released 2026-04-07 ═══════════════════**

## [2026-04-07] — Dependency update

**Type:** chore

### Changes

- Dependency update only: Angular 21.2.7, keycloakify 11.15.3 (dev). No library code changes.

**═══════════════════ v21.0.5 — released 2026-03-18 ═══════════════════**

## [2026-03-18] — Account boilerplate exports

**Type:** bugfix

### Changes

- `initialize-account-theme` boilerplate: `KcPage.ts` now exports `classes` and `doUseDefaultCss`, which the
  `KcPageStory.ts` boilerplate updated in 21.0.3 imports.

**═══════════════════ v21.0.4 — released 2026-03-18 ═══════════════════**

## [2026-03-18] — Account ClassKey imports

**Type:** bugfix

### Changes

- All account pages, the account `KcClassDirective`, `account.ts` and the account `KcPage.ts` boilerplate now import
  `ClassKey` from `keycloakify/account/lib/kcClsx` instead of the `keycloakify/account` root entry (completing the
  21.0.3 fix).

**═══════════════════ v21.0.3 — released 2026-03-18 ═══════════════════**

## [2026-03-18] — Account ClassKey import, DefaultPage removed

**Type:** bugfix

### Changes

- Account `ComponentReference` imports `ClassKey` from `keycloakify/account/lib/kcClsx` instead of the
  `keycloakify/account` root entry.
- **Removed the leftover `@keycloakify/angular/account/DefaultPage` entry point**; use `getDefaultPageComponent` from
  `@keycloakify/angular/account`.
- `initialize-account-theme` boilerplate `KcPageStory.ts`: passes the `classes` / `doUseDefaultCss` defined in
  `KcPage.ts` to `provideKeycloakifyAngular` instead of hard-coded values, and calls `markForCheck()` after the page
  loads so the story renders.

**═══════════════════ v21.0.2 — released 2026-03-15 ═══════════════════**

## [2026-03-15] — Dependency update

**Type:** chore

### Changes

- Dependency update only: Angular 21.2.4, ESLint 10. No library code changes.

**═══════════════════ v21.0.1 — released 2026-02-28 ═══════════════════**

## [2026-02-28] — Dependency update

**Type:** chore
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/47

### Changes

- Dependency update only: Angular 21.2, keycloakify 11.15.1 (dev), `qs` 6.14.1 (Dependabot). No library code
  changes.

**═══════════════════ v21.0.0 — released 2026-01-14 ═══════════════════**

## [2026-01-14] — Angular 21

**Type:** chore (breaking)
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/44

### Changes

- **Peer dependencies moved to Angular 21** (`@angular/core`, `@angular/common`, `@angular/platform-browser`
  `^21.0.0`) and **keycloakify `^11.13.0`**.
- **`eject-page` fix**: after ejecting `register.ftl` (or any page that also ejects `user-profile-form-fields`),
  `KcPage.ts` / `KcPageStory.ts` kept importing the user profile form fields component from the library; they now
  point to the ejected copy ([#46](https://github.com/keycloakify/keycloakify-angular/issues/46)).
- **CLI prettier resolution**: the bin now always loads prettier from the consumer project's `node_modules` (and
  resolves its config from the project root), the same fix as keycloakify-svelte#10.
- Internals: `verbatimModuleSyntax` enabled, so the sources use `import type` / inline `type` imports throughout;
  `login` page imports `NgClass` instead of `CommonModule`; the default-page error now names the missing `pageId`.

**═══════════════════ v20.1.12 — released 2025-11-15 ═══════════════════**

## [2025-11-15] — Explicit error for unknown login pages

**Type:** bugfix

### Changes

- `getDefaultPageComponent()` (login) now ends with a `default` branch that throws `FTL page not found!`, so an
  unhandled `pageId` fails loudly instead of silently resolving to `undefined`.
- Dependency update: keycloakify 11.11.3, Angular 20.3.12 (dev dependencies; peer ranges unchanged).

**═══════════════════ v20.1.11 — released 2025-10-21 ═══════════════════**

## [2025-10-21] — Dependency update

**Type:** chore

### Changes

- Dev dependencies bumped (Angular 20.3.6, keycloakify 11.9.14). No library code changes.

**═══════════════════ v20.1.10 — released 2025-10-16 ═══════════════════**

## [2025-10-16] — OnPush everywhere, NgClass cleanup

**Type:** feat
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/42

### Changes

- **All account pages now use `ChangeDetectionStrategy.OnPush`** (account, applications, federatedIdentity, log,
  password, sessions, totp), matching the login pages and the template.
- **`[ngClass]` replaced by native `[class.x]` bindings** in the account template (`active` menu item) and account page
  (`has-error`); the rendered CSS classes are the same.
- Internal cleanup: unused `NgClass`, `AsyncPipe`, `KcClassDirective` and `LogoutOtherSessionsComponent` imports
  removed from many components, type-only imports normalised to `import type`, and `inject<KcContext>()` typing added
  (also in the generated account `KcPageStory.ts` boilerplate). Contributed by Ruslan Lekhman (PRs #42, #43).

**═══════════════════ v20.1.9 — released 2025-10-15 ═══════════════════**

## [2025-10-15] — "Back to application" link renders HTML

**Type:** bugfix

### Changes

- **The `backToApplication` message is now rendered as sanitized HTML** (`[innerHTML]` + `kcSanitize: 'html'`) in the
  account page and in `logout-confirm.ftl`, so entities/markup in the translation (e.g. `&laquo;`) display correctly
  instead of as raw text.
- README fixes (broken starter links, PRs #38 and #39).
- Dependency update: Angular 20.3.4, keycloakify 11.9.12 (dev dependencies).

**═══════════════════ v20.1.8 — released 2025-09-16 ═══════════════════**

## [2025-09-16] — Zod 4 fix in the account theme initializer

**Type:** bugfix

### Changes

- `initialize-account-theme` CLI: the `package.json` schema uses `z.record(z.string(), z.unknown())`, the two-argument
  form required by Zod 4 (bumped in v20.1.7).
- Dependency update: keycloakify 11.9.6, Angular CLI/build 20.3.1 (dev dependencies).

**═══════════════════ v20.1.7 — released 2025-09-11 ═══════════════════**

## [2025-09-11] — Build fix for tsx 4.20.5

**Type:** chore

### Changes

- `tsx` pinned to `4.20.4` to work around build failures introduced by tsx 4.20.5.
- Tooling: Husky 4 → 9 (hook moved to `.husky/`, `lint-staged` config removed), TypeScript 5.9, Zod 4, Angular
  20.3.0, keycloakify 11.9.4 (dev dependencies; peer ranges unchanged).

**═══════════════════ v20.1.6 — released 2025-08-19 ═══════════════════**

## [2025-08-19] — keycloakify 11.9.3 (static JS scripts fix)

**Type:** bugfix

### Changes

- **Peer dependency raised to `keycloakify ^11.9.3`**, which fixes an issue with static JS scripts.
- README: all-contributors section added.

**═══════════════════ v20.1.5 — released 2025-08-15 ═══════════════════**

## [2025-08-15] — Correct input attributes and autocomplete hints

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/issues/37

### Changes

- **JSX-style attributes fixed in templates**: `autoComplete`, `autoFocus` and `readOnly` (React casing, ignored by the
  browser) became `autocomplete`, `autofocus` and `readonly` across account (account, password, totp) and login pages
  (login-config-totp, login-otp, login-oauth2-device-verify-user-code, login-passkeys-conditional-authenticate,
  login-recovery-authn-code-input, login-reset-password, login-update-password).
- **Better autocomplete hints for password managers**: `login.ftl` username gets `autocomplete="username"` and password
  `current-password` (was `off`); `login-username.ftl` uses `username` (was `off`); passkeys conditional login uses
  `username webauthn`; `login-password.ftl` gets `autocomplete="on"`.

**═══════════════════ v20.1.4 — released 2025-08-12 ═══════════════════**

## [2025-08-12] — Fix generated bootstrapKcApplication

**Type:** bugfix

### Changes

- The `default: throw new Error('wrong themeType')` branch added in v20.1.3 was emitted once per theme type inside the
  generated `switch`, producing duplicate `default` labels in `kc.gen.ts`; it is now emitted once, after all cases.

**═══════════════════ v20.1.3 — released 2025-08-12 ═══════════════════**

## [2025-08-12] — bootstrapKcApplication returns the ApplicationRef

**Type:** feat

### Changes

- **The generated `bootstrapKcApplication()` (written to `kc.gen.ts` by `update-kc-gen`) now returns
  `Promise<ApplicationRef>`**, and its `bootstrapApplication` callback is typed with Angular's `ApplicationRef` instead
  of the local `ApplicationRefLike`, so consumers can use the bootstrapped app reference.

**═══════════════════ v20.1.2 — released 2025-08-10 ═══════════════════**

## [2025-08-10] — keycloakify 11.9.2

**Type:** chore

### Changes

- Peer dependency raised to `keycloakify ^11.9.2`.

**═══════════════════ v20.1.1 — released 2025-08-09 ═══════════════════**

## [2025-08-09] — frontchannel-logout and register fixes

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/issues/34

### Changes

- **`frontchannel-logout.ftl` waits for the client iframes before redirecting**: the redirect to `logoutRedirectUri`
  previously fired immediately in `ngOnInit`; it now happens only after every client logout iframe has loaded, so
  front-channel logouts are not cut short.
- **`register.ftl` reCAPTCHA callback fixed**: the button's `data-callback` now points to a global
  `onSubmitRecaptcha` function (registered on init, removed on destroy) that calls `requestSubmit()` on the form,
  instead of binding a component method that reCAPTCHA could not resolve. Contributed in PR #36.

**═══════════════════ v20.1.0 — released 2025-08-07 ═══════════════════**

## [2025-08-07] — New Keycloak session checker, requestSubmit

**Type:** feat

### Changes

- **Peer dependency raised to `keycloakify ^11.9.0`.** Port of the upstream fix for keycloakify issue #903
  (https://github.com/keycloakify/keycloakify/issues/903).
- **Session checking updated to the new `authChecker.js` API**: the login resource injector now imports
  `startSessionPolling` (replacing `checkCookiesAndSetTimer`) and, when `kcContext.authenticationSession` is present,
  calls `checkAuthSession(authSessionIdHash)`.
- **Forms are submitted with `requestSubmit()` instead of `submit()`** (register, idp-review-user-profile,
  saml-post-form, webauthn-error, "try another way" in the login template), so `submit` events and handlers fire.
- Dependency update: Angular 20.1.3 (dev dependencies).

**═══════════════════ v20.0.2 — released 2025-07-24 ═══════════════════**

## [2025-07-24] — Re-release of v20.0.1

**Type:** chore

### Changes

- No changes: `v20.0.2` points to the same commit as `v20.0.1` (the version-bump commit to 20.0.2 that both tags
  share).

**═══════════════════ v20.0.1 — released 2025-07-24 ═══════════════════**

## [2025-07-24] — Fix inverted displayMessage

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/issues/33

### Changes

- **`displayMessage` was inverted** on several login pages: it was `true` exactly when a field error existed, so the
  global alert showed (or hid) the wrong way round. It is now `!messagesPerField.existsError(...)` on
  idp-review-user-profile, login-config-totp, login-idp-link-confirm, login-idp-link-confirm-override,
  login-update-password, login-username and register.

**═══════════════════ v20.0.0 — released 2025-06-15 ═══════════════════**

## [2025-06-15] — Angular 20, version aligned with Angular

**Type:** feat (breaking)
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/32

### Changes

- **Version jump 0.2.24 → 20.0.0**: the library's major version now matches the supported Angular major.
- **Peer dependencies moved to Angular `^20.0.0`** (`@angular/core`, `@angular/common`, `@angular/platform-browser`);
  Angular 19 is no longer supported. keycloakify peer stays `^11.8.0`.
- Angular migrations applied: `DOCUMENT` is now imported from `@angular/core` in the login and account providers;
  the build moved from `@angular-devkit/build-angular` to `@angular/build`.

**═══════════════════ v0.2.24 — released 2025-05-18 ═══════════════════**

## [2025-05-18] — Info page matches info.ftl

**Type:** bugfix

### Changes

- **`info.ftl` page:** the three links (`pageRedirectUri`, `actionUri`, `client.baseUrl`) are now mutually exclusive
  (`@if / @else if`) as in the Keycloak template; before, two independent `@if` blocks could render a duplicated
  "Back to Application" link.

**═══════════════════ v0.2.23 — released 2025-05-16 ═══════════════════**

## [2025-05-16] — Hidden user profile attributes

**Type:** bugfix

### Changes

- **User profile attributes with `inputType: 'hidden'`** are now rendered by `kc-input-field-by-type` as a plain
  `<input type="hidden">`, and `kc-user-profile-form-fields` hides their form group (`display: none`). Port of the
  upstream keycloakify fix (https://github.com/keycloakify/keycloakify/commit/fa5814ac8f5391569d04bfed0f8a183d4bdef92e).
- The hidden `locale` input added in v0.2.19 as a workaround for Keycloak issue 38029 was removed from the user
  profile form.
- Dependencies: Angular 19.2.11, keycloakify 11.8.27 (dev).

**═══════════════════ v0.2.22 — released 2025-04-09 ═══════════════════**

## [2025-04-09] — Login page message display restored

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/29

### Changes

- **`login.ftl` page:** `displayMessage` is again `!messagesPerField.existsError('username', 'password')`, reverting
  for this page the inversion made in v0.2.18 (community contribution).

**═══════════════════ v0.2.21 — released 2025-03-16 ═══════════════════**

## [2025-03-16] — SAML POST form auto-submit

**Type:** bugfix

### Changes

- **`saml-post-form.ftl` page:** the form reference is now read as `viewChild<ElementRef<HTMLFormElement>>` and
  submitted via `nativeElement.submit()`; previously `.submit()` was called on the `ElementRef` itself, so the SAML
  form was never auto-submitted.
- **CLI `eject-page`:** when ejecting the template or `user-profile-form-fields`, the import is now rewritten in both
  `KcPage.ts` and `KcPageStory.ts` (missing files are skipped with a warning) instead of only `KcPage.ts`.

**═══════════════════ v0.2.20 — released 2025-03-16 ═══════════════════**

## [2025-03-16] — CLI linking fixes

**Type:** chore

### Changes

- CLI internals: the package root is now located by its `LICENSE` file instead of the first `package.json`, and, when
  the library is linked locally (version `0.0.0`), Prettier is loaded through a dynamic `import()` in ESM mode instead
  of `require()`.

**═══════════════════ v0.2.19 — released 2025-03-14 ═══════════════════**

## [2025-03-14] — Locale in user profile forms, account selector rename

**Type:** bugfix (breaking)

### Changes

- **User profile forms:** `kc-user-profile-form-fields` now adds a hidden `locale` input with the current language
  when the realm has a locale and no `locale` attribute is part of the form, working around Keycloak issue
  https://github.com/keycloak/keycloak/issues/38029.
- **Selector rename:** the account `federatedIdentity` page component selector changed from `kc-federatedIdentity`
  to `kc-federated-identity`; update any template that references the old selector.
- ESLint configuration extended to `src/` and lint warnings fixed (unused imports in the account template, unused
  `eslint-disable` comments in `KcClassDirective`).
- Dependencies: Angular 19.2.2, keycloakify 11.8.21 (dev).

**═══════════════════ v0.2.18 — released 2025-03-10 ═══════════════════**

## [2025-03-10] — Error message display, library declared usable

**Type:** bugfix

### Changes

- **Error message display:** the `displayMessage` flag passed to the template was inverted on `login.ftl`,
  `login-username.ftl`, `register.ftl`, `login-update-password.ftl`, `login-config-totp.ftl`,
  `login-idp-link-confirm.ftl`, `login-idp-link-confirm-override.ftl` and `idp-review-user-profile.ftl`: the alert
  banner is now shown when the page's fields have errors (the `login.ftl` change was reverted in v0.2.22).
- The README no longer warns that the library is not ready for use.
- Dependencies: Angular 19.2, TypeScript 5.8, keycloakify 11.8.17 (dev).

**═══════════════════ v0.2.17 — released 2025-01-22 ═══════════════════**

## [2025-01-22] — Node engine pin removed

**Type:** chore

### Changes

- The `engines.node` pin (`22.12.0`) was removed from the root `package.json` to unblock the build; no library change.

**═══════════════════ v0.2.16 — released 2025-01-22 ═══════════════════**

## [2025-01-22] — keycloakify 11.8 peer

**Type:** chore

### Changes

- `keycloakify` peer dependency raised to `^11.8.0`.
- Dependencies: Angular 19.1 (dev).

**═══════════════════ v0.2.15 — released 2025-01-06 ═══════════════════**

## [2025-01-06] — Standalone cleanup

**Type:** chore

### Changes

- The redundant `standalone: true` flag (default since Angular 19) was removed from the remaining directives
  (`kcClass`, `kcAttributes`) and pipes (`kcSanitize`, `inputType`, `toArray`, `toNumber`, `isArrayWithEmptyObject`).
- Dependencies: Angular 19.0.5, angular-eslint 19, TypeScript 5.6, keycloakify 11.8.5 (dev).

**═══════════════════ v0.2.14 — released 2025-01-03 ═══════════════════**

## [2025-01-03] — Account theme boilerplate i18n

**Type:** chore

### Changes

- The `i18n.ts` generated by `initialize-account-theme` is simplified: plain
  `i18nBuilder.withThemeName<ThemeName>().build()` with a link to the i18n docs, type-only `ThemeName` import, and no
  more empty `withExtraLanguages({})` / `withCustomTranslations({})` placeholders.

**═══════════════════ v0.2.13 — released 2025-01-03 ═══════════════════**

## [2025-01-03] — eject-page "other page" option

**Type:** feat

### Changes

- **CLI `eject-page`:** new last choice "The page you're looking for isn't listed here", for both login and account
  themes, which points to the docs on styling a page not included in base Keycloak (e.g. from a third-party extension)
  and exits.
- The README again flags the library as not ready yet.

**═══════════════════ v0.2.12 — released 2024-12-30 ═══════════════════**

## [2024-12-30] — keycloakify 11.7, admin theme guard

**Type:** chore

### Changes

- `keycloakify` peer dependency raised to `^11.7.0`.
- **CLI:** `initialize-admin-theme` now exits with "Cannot create an admin theme when using Angular." instead of
  falling through as not implemented.
- The README no longer warns that the library is not ready (the warning came back in v0.2.13).

**═══════════════════ v0.2.11 — released 2024-12-16 ═══════════════════**

## [2024-12-16] — keycloakify 11.5

**Type:** chore

### Changes

- `keycloakify` peer dependency raised to `^11.5.0`; development Node version moved to 22.12.0.

**═══════════════════ v0.2.10 — released 2024-12-09 ═══════════════════**

## [2024-12-09] — keycloakify 11.4.5

**Type:** chore

### Changes

- `keycloakify` peer dependency raised to `^11.4.5`.

**═══════════════════ v0.2.9 — released 2024-12-08 ═══════════════════**

## [2024-12-08] — kc.gen.ts for account themes

**Type:** bugfix

### Changes

- **CLI `update-kc-gen`:** the generated `kc.gen.ts` imported `@keycloakify/angular/login/providers/keycloakify-angular`
  for every theme type; it now imports the providers of the matching theme type, so account themes get
  `@keycloakify/angular/account/providers/keycloakify-angular`.

**═══════════════════ v0.2.8 — released 2024-12-08 ═══════════════════**

## [2024-12-08] — CLI admin theme type

**Type:** bugfix

### Changes

- **CLI `eject-page` / `add-story`:** the new `admin` theme type from keycloakify is handled explicitly (reported as
  not implemented, no pages offered) instead of being silenced with `@ts-ignore`.

**═══════════════════ v0.2.7 — released 2024-12-08 ═══════════════════**

## [2024-12-08] — App initializer injection context

**Type:** bugfix

### Changes

- **`provideKeycloakifyAngular` (login and account):** the `provideAppInitializer` introduced in v0.2.0 called
  `inject(I18nService)` and `inject(KC_*_CONTEXT)` when the providers were built, outside an injection context; the
  `inject()` calls now run inside the initializer callback, so i18n loads correctly at bootstrap.

**═══════════════════ v0.2.6 — released 2024-12-08 ═══════════════════**

## [2024-12-08] — CLI `__dirname` in ESM

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/27

### Changes

- The CLI failed with "`__dirname` is not defined" now that it runs as ESM: `__dirname` is derived from
  `import.meta.url` in `getThisCodebaseRootDirPath`.

**═══════════════════ v0.2.5 — released 2024-12-08 ═══════════════════**

## [2024-12-08] — Peer dependencies for Angular 19

**Type:** bugfix

### Changes

- **Peer dependencies fixed:** `@angular/core`, `@angular/common` and `@angular/platform-browser` now require `^19.0.0`
  (they still said `^18.0.0` after the v0.2.0 migration), and `keycloakify` is raised to `^11.4.3`.

**═══════════════════ v0.2.4 — released 2024-12-05 ═══════════════════**

## [2024-12-05] — Release script

**Type:** chore

### Changes

- The release script no longer creates the git tag itself; no library change.

**═══════════════════ v0.2.3 — released 2024-12-05 ═══════════════════**

## [2024-12-05] — ESM CLI build

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/25

### Changes

- **CLI build for ESM:** the bin is now bundled by ncc directly from the TypeScript sources and published as
  `bin/index.js`; `BIN_NAME`, `NOT_IMPLEMENTED_EXIT_CODE` and `readParams` are re-exported explicitly from
  keycloakify's `customHandler` instead of `export *`.
- Release tooling added (`scripts/release.sh`, conventional-changelog).

**═══════════════════ v0.2.2 — released 2024-11-26 ═══════════════════**

## [2024-11-26] — Story cleanup

**Type:** chore

### Changes

- The Storybook story for the removed `login-device-verify-user-code.ftl` page was deleted; no library change.

**═══════════════════ v0.2.1 — released 2024-11-22 ═══════════════════**

## [2024-11-22] — CLI tsconfig restored

**Type:** chore

### Changes

- The CLI `tsconfig.json` changed in v0.2.0 (ES2022, `bundler` resolution) was restored to its previous settings
  (ES2020 module, ES2017 target, `node` resolution).

**═══════════════════ v0.2.0 — released 2024-11-22 ═══════════════════**

## [2024-11-22] — Angular 19

**Type:** feat (breaking)
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/22

### Changes

- **Angular 19:** the library is built with Angular 19 and ng-packagr 19; Angular 18 stays on 0.1.8. (The peer ranges
  in the published package were only updated to `^19.0.0` in v0.2.5.)
- **`provideKeycloakifyAngular` (login and account):** the deprecated `APP_INITIALIZER` multi-provider is replaced by
  `provideAppInitializer` (see v0.2.7 for the injection-context fix).
- The redundant `standalone: true` flag was removed from all page, template and shared components (standalone is the
  default in Angular 19); the published package is now marked `"type": "module"`.
- Internals: development Node 22.11.0; `link-in-app` runs the app's `postinstall` / `prepare` scripts after linking.

**═══════════════════ v0.1.8 — released 2024-11-18 ═══════════════════**

## [2024-11-18] — Info page selector fix, Prettier when linked

**Type:** bugfix

### Changes

- **The `info.ftl` page selector was `kc-ínfo`** (accented `í`): it is now `kc-info`.
- CLI internals: when the package is linked into a project for local development (version `0.0.0-*`), the CLI now
  loads the project's own Prettier instead of the one bundled with this repo, so generated files are formatted with
  the right version.

**═══════════════════ v0.1.7 — released 2024-11-17 ═══════════════════**

## [2024-11-17] — `beforeField` template slot and Terms button typos

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/17

### Changes

- **`UserProfileFormFieldsComponent` looked for a `#beforField` content template**: the query is now `#beforeField`,
  so a projected `<ng-template #beforeField>` is actually rendered before each field (the `#afterField` slot was
  already correct).
- `terms.ftl`: the Accept button listed `kcButtonClass` three times; the duplicates were removed.
- CLI: Prettier now resolves its configuration per generated file, so `overrides` in the project's Prettier config
  are honoured by `eject-page`, `add-story` and `update-kc-gen`.

**═══════════════════ v0.1.6 — released 2024-11-16 ═══════════════════**

## [2024-11-16] — Formatting of ejected pages

**Type:** bugfix

### Changes

- `eject-page` ran Prettier against the source path inside `node_modules` instead of the destination path in the
  project, so the project's Prettier config/ignore rules were not applied: it now formats using the destination
  path.

**═══════════════════ v0.1.5 — released 2024-11-12 ═══════════════════**

## [2024-11-12] — Reset password label fix, eject-page next to stories

**Type:** bugfix
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/16

### Changes

- **`login-reset-password.ftl` showed the wrong label**: the condition was inverted, so "Username" appeared when
  login with email was allowed. It now shows "Username" only when email login is disabled, "Username or email"
  otherwise (or "Email" when email is used as username).
- `eject-page` refused to eject a page whose folder already existed, e.g. because `add-story` had put a
  `*.stories.ts` there: it now only stops when the folder already contains the `<page>.component.ts`.

**═══════════════════ v0.1.4 — released 2024-11-10 ═══════════════════**

## [2024-11-10] — Storybook global renamed to `kcContext`

**Type:** chore

### Changes

- In the Storybook setup (`KcPageStory` decorators of the bundled stories and of the `initialize-account-theme`
  boilerplate) the global used to override the mock context was renamed from `overrides` to `kcContext`; the bundled
  stories were updated accordingly.

**═══════════════════ v0.1.3 — released 2024-11-10 ═══════════════════**

## [2024-11-10] — Clearer `eject-page` instructions

**Type:** chore

### Changes

- After ejecting a page, the CLI now prints a cleaner, colour-highlighted snippet of the `getKcPage()` `case` to add
  to `KcPage.ts`, including the `TemplateComponent`, `doUseDefaultCss`, `classes` (and, for login,
  `UserProfileFormFieldsComponent` / `doMakeUserConfirmPassword`) entries and the `default` branch.

**═══════════════════ v0.1.2 — released 2024-11-10 ═══════════════════**

## [2024-11-10] — Account boilerplate: `KcPageStory.ts`

**Type:** bugfix

### Changes

- The account theme boilerplate file added in v0.1.1 was renamed from `KcContextMock.ts` to `KcPageStory.ts` and
  now imports the **account** providers, template, `KC_ACCOUNT_CONTEXT` and `createGetKcContextMock` (v0.1.1
  mistakenly imported the login ones).

**═══════════════════ v0.1.1 — released 2024-11-10 ═══════════════════**

## [2024-11-10] — Storybook support in the account boilerplate

**Type:** feat

### Changes

- `initialize-account-theme` now generates, besides the context mock, the Storybook `decorators` and a `KcPageStory`
  component (`kc-page-story`) that render the selected account page inside `kc-root`, so account stories work out
  of the box.

**═══════════════════ v0.1.0 — released 2024-11-10 ═══════════════════**

## [2024-11-10] — Storybook stories and `add-story` command

**Type:** feat
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/15

### Changes

- **Storybook stories for every page** (login and account) now ship with the package under `stories/`, together with
  a `KcPageStory` helper per theme type that accepts a `userProfileFormFields` input.
- **`npx keycloakify add-story` is now supported**: it asks for the theme type and page and copies the matching
  `*.stories.ts` into `<theme>/pages/<page>/` of the project (previously the command printed "not yet supported").
- The CLI no longer runs the project's `format`/`lint` npm scripts on the whole codebase: only the files it generates
  (`eject-page`, `add-story`, `kc.gen.ts`) are formatted, using the project's Prettier when available.

**═══════════════════ v0.0.11 — released 2024-11-09 ═══════════════════**

## [2024-11-09] — Template moved out of `containers`, reworked page injection

**Type:** feat (breaking)
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/14

### Changes

- **Template entry points moved**: `@keycloakify/angular/login/containers/template` and
  `@keycloakify/angular/account/containers/template` are now `@keycloakify/angular/login/template` and
  `@keycloakify/angular/account/template`. Update the `TemplateComponent` import in `KcPage.ts` (the CLI boilerplate
  and `eject-page` already use the new paths).
- **Page injection reworked**: the intermediate `kc-dynamic-page-injector` component is gone; `kc-root` now creates the
  page component directly into an `<ng-template #pageRef>` from an effect that is destroyed once the page is rendered,
  so the page is instantiated only once.
- Peer dependency: `keycloakify` `^11.3.16`.
- Internals: every secondary entry point uses `index.ts` as entry file instead of `public-api.ts`; node engine
  pinned to 22.9.0.

**═══════════════════ v0.0.10 — released 2024-10-25 ═══════════════════**

## [2024-10-25] — keycloakify 11.3.12

**Type:** chore

### Changes

- Peer dependency `keycloakify` raised to `^11.3.12`; README updates.

**═══════════════════ v0.0.9 — released 2024-10-25 ═══════════════════**

## [2024-10-25] — `kc.gen.ts` regenerated only on change

**Type:** chore

### Changes

- `update-kc-gen` now writes a SHA-256 hash in the header of `kc.gen.ts` and skips the regeneration (and the
  formatting) when the content has not changed. The generated file is marked `/* eslint-disable */` and
  `// @ts-nocheck`.
- Peer dependency: `keycloakify` `^11.3.11`.

**═══════════════════ v0.0.8 — released 2024-10-25 ═══════════════════**

## [2024-10-25] — Formatted `kc.gen.ts`

**Type:** chore

### Changes

- `update-kc-gen` no longer wraps `kc.gen.ts` in `prettier-ignore`/`eslint-disable` markers: after writing it, it runs
  the project's `format` and `lint` scripts (the same helper is now shared with `eject-page`).
- Peer dependency: `keycloakify` `^11.3.10`.
- Internals: the `link-in-app` script now works on Windows.

**═══════════════════ v0.0.7 — released 2024-10-24 ═══════════════════**

## [2024-10-24] — Recovery codes script after view init

**Type:** bugfix

### Changes

- `login-recovery-authn-code-config.ftl`: the copy/download/print script is now injected in `ngAfterViewInit`
  instead of the constructor, so it finds the buttons and the codes list in the DOM.

**═══════════════════ v0.0.6 — released 2024-10-24 ═══════════════════**

## [2024-10-24] — Recovery codes buttons working

**Type:** bugfix

### Changes

- **`login-recovery-authn-code-config.ftl` buttons did nothing**: the page now injects the script (as Keycloak does)
  that wires the Copy, Download and Print buttons for the recovery codes.
- `register.ftl`: the "Back to login" link is rendered again via `[innerHTML]` with `kcSanitize`, reverting the
  plain-text change made in v0.0.5.

**═══════════════════ v0.0.5 — released 2024-10-21 ═══════════════════**

## [2024-10-21] — User profile form on keycloakify's framework-agnostic API

**Type:** chore (breaking)
**Ref:** https://github.com/keycloakify/keycloakify-angular/pull/10

### Changes

- **`UserProfileFormService` rewritten** on top of `keycloakify/login/lib/getUserProfileApi` (the framework-agnostic
  user profile logic of keycloakify core) instead of a ~1500-line Angular copy; it exposes the form state as the
  `formState$` observable, and `getButtonToDisplayForMultivaluedAttributeField` is re-exported from it.
- **`SubmitService` removed** (entry point `@keycloakify/angular/login/services/submit`): `register`,
  `login-update-profile`, `idp-review-user-profile` and `update-email` now derive `isFormSubmittable` from
  `UserProfileFormService.formState$`. Ejected pages using `SubmitService` must be updated.
- Peer dependency: `keycloakify` `^11.3.9` (required by the new API).
- Internals: `zone.js` removed from the dev setup (zoneless), TypeScript 5.5.

**═══════════════════ v0.0.4 — released 2024-10-21 ═══════════════════**

## [2024-10-21] — Default CSS prepended to `<head>`

**Type:** bugfix

### Changes

- **Keycloak's default stylesheets are now inserted at the top of `<head>`** instead of appended, so the theme's own
  styles come after them and win the cascade. The login stylesheet list was reversed to keep the original order.
- `login-username.ftl`: removed a stray empty HTML comment.
- Internals: Node pinned to 22.4.1 in CI/engines while a Node/tsx bug is open; README updated.

**═══════════════════ v0.0.3 — released 2024-10-15 ═══════════════════**

## [2024-10-15] — Custom pages type-check

**Type:** bugfix

### Changes

- `provideKeycloakifyAngular()` (login and account) now types `kcContext` as `unknown`, so projects whose `KcContext`
  is extended with custom pages or properties no longer fail type-checking when passing it.

**═══════════════════ v0.0.2 — released 2024-10-15 ═══════════════════**

## [2024-10-15] — `class` attribute fix

**Type:** bugfix

### Changes

- `login-oauth-grant`, `register` and `terms` used the React `className` attribute in their templates, so
  `clearfix` and `form-group` were never applied: they now use `class`.

**═══════════════════ v0.0.1 — released 2024-10-11 ═══════════════════**

## [2024-10-11] — First release

**Type:** feat

### Changes

- **First stable release** after 126 commits started on 2024-09-23 and 26 release candidates (`v0.0.1-rc.0`, published
  2024-09-30, to `v0.0.1-rc.27`).
- **Login theme**: 36 standalone, `OnPush` page components (from `login.ftl`, `register.ftl` and the WebAuthn pages to
  `saml-post-form.ftl`) plus the shared form components (`UserProfileFormFieldsComponent`, field errors, password
  wrapper, input/select/textarea tags, multi-valued attribute buttons, logout-other-sessions), rendered inside the
  `kc-root` template component.
- **Account theme**: 7 pages (`account`, `password`, `totp`, `federatedIdentity`, `sessions`, `applications`, `log`)
  with their own template.
- **Configuration through `provideKeycloakifyAngular()`**, which fills the DI tokens `KC_LOGIN_CONTEXT` /
  `KC_ACCOUNT_CONTEXT`, `LOGIN_I18N` / `ACCOUNT_I18N`, `LOGIN_CLASSES` / `ACCOUNT_CLASSES`, `USE_DEFAULT_CSS` and
  `DO_MAKE_USER_CONFIRM_PASSWORD`; `getDefaultPageComponent()` lazy-loads the page for a `pageId`. Shared
  utilities: `kcClass` directive, `kcSanitize`/`toArray`/`inputType` pipes, resource injector for Keycloak's CSS/JS.
- **CLI integration with keycloakify**: `update-kc-gen` (generates `kc.gen.ts` with `bootstrapKcApplication`),
  `eject-page` and `initialize-account-theme`. Peer dependencies: Angular `^18.0.0`, keycloakify `^11.3.4`.
