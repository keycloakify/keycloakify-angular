#!/bin/sh
# Stamps a version delimiter into CHANGELOG.md at release time.
#
# Buckets the changelog by *stable / fix* release: inserts a delimiter line
# above the topmost entry, so every entry written since the previous release
# (the ones with no delimiter above them) gets bucketed under this version.
# If no entry was written since the previous release (its delimiter already
# sits above the topmost entry), the new delimiter goes above that one,
# leaving this version an empty bucket.
# Release candidates (rc) are NOT stamped (see scripts/release.sh).
#
# Usage: scripts/stamp-changelog.sh <version> [date]
#   <version>  e.g. 1.6.1  (a leading "v" is added in the delimiter)
#   [date]     YYYY-MM-DD, defaults to today
#
# Idempotent: if the topmost delimiter already names <version> (any date), it
# is a no-op.

version="$1"
if [ -z "$version" ]; then
  echo "stamp-changelog: missing <version> argument" >&2
  exit 1
fi
date="${2:-$(date +%Y-%m-%d)}"

changelog="$(dirname "$0")/../CHANGELOG.md"
if [ ! -f "$changelog" ]; then
  echo "stamp-changelog: CHANGELOG.md not found at $changelog" >&2
  exit 1
fi

pad="═══════════════════"
delim="**${pad} v${version} — released ${date} ${pad}**"

tmp="$(mktemp)"
awk -v delim="$delim" -v tag=" v${version} — released " '
  { line[NR] = $0 }
  END {
    first = 0
    for (i = 1; i <= NR; i++) if (line[i] ~ /^## \[/) { first = i; break }
    if (first == 0) { exit 2 }                       # no entry found
    # topmost delimiter above the first entry: no entry was written since
    # that release, so the new delimiter goes above it (an empty bucket)
    at = first
    for (i = 1; i < first; i++) {
      if (line[i] ~ /^\*\*═.*released.*═\*\*$/) {
        if (index(line[i], tag)) { exit 3 }          # already stamped (any date)
        at = i                                       # older version delimiter — stamp above it
        break
      }
    }
    for (i = 1; i <= NR; i++) {
      if (i == at) { print delim; print "" }
      print line[i]
    }
    exit 0
  }
' "$changelog" >"$tmp"
rc=$?

case "$rc" in
0)
  mv "$tmp" "$changelog"
  echo "stamp-changelog: stamped v${version} (released ${date})"
  ;;
3)
  rm -f "$tmp"
  echo "stamp-changelog: v${version} already stamped — no-op"
  ;;
2)
  rm -f "$tmp"
  echo "stamp-changelog: no \"## [\" entry found in CHANGELOG.md" >&2
  exit 1
  ;;
*)
  rm -f "$tmp"
  echo "stamp-changelog: awk failed (rc=$rc)" >&2
  exit 1
  ;;
esac
