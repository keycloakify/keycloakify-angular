#!/bin/sh

# Increments the project version (e.g. from 2.3.0 to 2.4.0)
# It handles stuff like
# * CHANGELOG
# * Package version
# * Git tags

# Credits for original version to Luca Ravizzotti

# Calculating the new version requires to know which kind of update this is
# The default version increment is patch
# Used values: major|minor|patch where in x.y.z :
# major=x
# minor=y
# patch=z

while getopts ":v:r:t" arg; do
  case $arg in
  v) versionType=$OPTARG ;;
  r) releaseType=$OPTARG ;;
  t) tag=1 ;;
  *)
    printf "\n"
    printf "%s -v [none|patch|minor|major] -r [rel] -d -t" "$0"
    printf "\n"
    printf "\n\t -v version type, default: none"
    printf "\n\t -r release type, default: rel"
    printf "\n\t -t define if should tag and commit, default: false"
    printf "\n\n"
    exit 0
    ;;
  esac
done

# Version type = none|patch|minor|major
if [ -z "$versionType" ]; then
  versionType="none"
fi
if [ "$versionType" != "none" ] && [ "$versionType" != "patch" ] && [ "$versionType" != "minor" ] && [ "$versionType" != "major" ]; then
  echo "Version type not supported, try with -h for help"
  exit 1
fi

# Release type = pre|rc|fix|rel
if [ -z "$releaseType" ] || [ "$releaseType" = "rel" ]; then
  releaseType=""
fi
if [ "$releaseType" != "" ]; then
  echo "Release type not supported, try with -h for help"
  exit 1
fi

# Get current git branch name
branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch" != "main" ]; then
  echo "Release can be done only on main branch"
  exit 1
fi

if [ "$branch" = "main" ] && [ "$releaseType" != "" ]; then
  echo "Release type not supported on main branch"
  exit 1
fi

# Version bump only if needed
if [ "$versionType" != "none" ]; then
  if [ "$releaseType" = "" ]; then
    # Increment version without creating a tag and a commit (we will create them later)
    npm --no-git-tag-version version "$versionType" || exit 1
  fi
fi

# Using the package.json version
version="$(jq -r '.version' "$(dirname "$0")/../package.json")"

# changelog from tags only on release
if [ "$versionType" != "none" ] && [ -z "$tag" ]; then
  git add package.json yarn.lock
  git commit -m "chore(version): 💯 bump version to $version"
fi

# Avoid tagging prerelease
if [ -n "$tag" ]; then
  rm CHANGELOG.md
  npm run changelog

  git add package.json CHANGELOG.md
  git commit -m "chore(release): 📦 release $version"

  # Create an annotated tag
  git tag -a "$version" -m "🏷️ Release $version"
fi

if [ -n "$tag" ] || [ "$versionType" != "none" ]; then
  # Gotta push them all
  git push --follow-tags
fi

