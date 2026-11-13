---
name: changelog-update
description: Add or reorder entries in the repo-root CHANGELOG.md — new entries go at the top, and stable releases get an auto-stamped version delimiter. Use when writing a changelog entry or touching CHANGELOG.md's version delimiters.
---

# Changelog

The changelog lives at `CHANGELOG.md` at the repo root. Entries are written by hand (by Claude, optionally enriched by the maintainer): there is no auto-generation tooling (conventional-changelog has been removed).

## Entry format

```markdown
## [YYYY-MM-DD] — Short human title

**Type:** feat | bugfix | chore | docs (append " (breaking)" for breaking changes)
**Ref:** https://github.com/keycloakify/keycloakify-angular/issues/<n> (optional: issue or PR)

### Changes

- What changed and **why**, in plain English, from the library user's point of view first (components, API,
  DI tokens, peer dependencies), then internals. Bold the lead-in of the important bullets.
- Mention what was verified (`pnpm build`, `pnpm lint`, linking into a starter, …) when relevant.

### Files modified

- `path/to/file` — what changed in it
```

- Lines wrapped at 120 characters, continuation lines indented by two spaces.
- Dependency-only changes get one short entry (`**Type:** chore`, "Dependency update"), naming only notable bumps
  (Angular major/minor, keycloakify, peer dependency ranges).

## Ordering

New entries go **at the top**, immediately after the intro line under `# Changelog` — never appended at the bottom.

- Use `Edit` (or `Read` → in-memory splice → `Write`) — not `cat >> CHANGELOG.md`.
- When a session produces multiple entries, write each one on top as you go so the latest is always near the top.

## Version delimiters (stable releases only, auto-stamped)

The changelog is bucketed by **stable** release with inline delimiter lines. Release candidates (`rc`) are **not**
marked. Format:

```
**═══════════════════ v22.1.0 — released 2026-09-01 ═══════════════════**
```

- There is **no "Unreleased" marker**. The newest entries simply sit at the top with no delimiter above them until a
  release stamps one.
- A delimiter sits **above** the block of entries that shipped in that version; entries stay `## [date]` headers (the
  delimiter is a plain bold line, not a markdown heading, to avoid colliding with the entry hierarchy).
- **Stamping is automated**: `scripts/stamp-changelog.sh <version> [date]` (POSIX sh + awk) inserts the delimiter
  above the topmost `## [` entry — or, when no entry was written since the previous release (its delimiter already
  sits above the topmost entry), above that delimiter, leaving the new version an empty bucket. Idempotent: a no-op
  if the topmost delimiter already names the version, whatever its date. `scripts/release.sh` calls it on every
  stable release (`-v patch|minor|major` without `-r rc`) and commits `CHANGELOG.md` with the version bump.
- To stamp by hand (rare): `sh scripts/stamp-changelog.sh 22.1.1`.
