// @ts-check
/**
 * Replacement for `garronej/ts-ci` action `is_package_json_version_upgraded`.
 *
 * It compares the `version` in the local package.json (to_version) against the
 * latest sem-versioned git tag (from_version) and emits four outputs to
 * $GITHUB_OUTPUT: from_version, to_version, is_upgraded_version, is_pre_release.
 *
 * The semver logic mirrors ts-ci's NpmModuleVersion / getLatestSemVersionedTag:
 *  - version format: `X.Y.Z` with an optional `-rc.N` suffix
 *  - a regular release sorts AFTER its release candidate (1.0.0 > 1.0.0-rc.9)
 *  - from_version: the latest tag matching to_version's RC policy (only-RC when
 *    to_version is an RC, otherwise ignore-RC), preferring the same major; if no
 *    tag matches the major it falls back to any major; if none at all -> 0.0.0
 *
 * Requires a checkout with tags available (fetch-tags: true, or fetch-depth: 0).
 */

import { execSync } from 'node:child_process';
import { readFileSync, appendFileSync } from 'node:fs';

/**
 * @typedef {{ major: number; minor: number; patch: number; rc?: number }} Version
 */

/** @param {string} versionStr @returns {Version | undefined} */
function parse(versionStr) {
    const match = versionStr
        .trim()
        .match(/^([0-9]+)\.([0-9]+)\.([0-9]+)(?:-rc\.([0-9]+))?$/);

    if (match === null) {
        return undefined;
    }

    /** @type {Version} */
    const version = {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3])
    };

    if (match[4] !== undefined) {
        version.rc = parseInt(match[4]);
    }

    return version;
}

/** @param {Version} v @returns {string} */
function stringify(v) {
    return `${v.major}.${v.minor}.${v.patch}${v.rc !== undefined ? `-rc.${v.rc}` : ''}`;
}

/** @param {Version} v1 @param {Version} v2 @returns {-1 | 0 | 1} */
function compare(v1, v2) {
    // An absent rc means a stable release, which sorts after any rc.
    const noUndefined = (/** @type {number | undefined} */ n) =>
        n === undefined ? Infinity : n;

    const fields = /** @type {const} */ (['major', 'minor', 'patch', 'rc']);

    for (const field of fields) {
        const a = field === 'rc' ? noUndefined(v1.rc) : v1[field];
        const b = field === 'rc' ? noUndefined(v2.rc) : v2[field];

        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
    }

    return 0;
}

/**
 * @param {Version[]} tagVersions
 * @param {{ major: number | undefined; onlyRc: boolean }} param
 * @returns {Version | undefined}
 */
function getLatestSemVersionedTag(tagVersions, { major, onlyRc }) {
    /** @type {Version | undefined} */
    let latest = undefined;

    for (const version of tagVersions) {
        if (major !== undefined && version.major !== major) {
            continue;
        }

        const isRc = version.rc !== undefined;

        // rcPolicy: "ONLY LOOK FOR RC" vs "IGNORE RC"
        if (onlyRc ? !isRc : isRc) {
            continue;
        }

        if (latest === undefined || compare(version, latest) === 1) {
            latest = version;
        }
    }

    return latest;
}

const toVersion = parse(JSON.parse(readFileSync('package.json', 'utf-8')).version);

if (toVersion === undefined) {
    throw new Error('No valid version in package.json');
}

const tagVersions = execSync('git tag', { encoding: 'utf-8' })
    .split('\n')
    .map(tag => parse(tag.replace(/^[vV]/, '')))
    .filter(/** @returns {v is Version} */ v => v !== undefined);

const onlyRc = toVersion.rc !== undefined;

const fromVersion =
    getLatestSemVersionedTag(tagVersions, { major: toVersion.major, onlyRc }) ??
    getLatestSemVersionedTag(tagVersions, { major: undefined, onlyRc }) ??
    /** @type {Version} */ ({ major: 0, minor: 0, patch: 0 });

const is_upgraded_version = compare(toVersion, fromVersion) === 1 ? 'true' : 'false';

const is_pre_release =
    is_upgraded_version === 'false'
        ? 'false'
        : toVersion.rc !== undefined
          ? 'true'
          : 'false';

const outputs = {
    from_version: stringify(fromVersion),
    to_version: stringify(toVersion),
    is_upgraded_version,
    is_pre_release
};

console.log(outputs);

if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
        process.env.GITHUB_OUTPUT,
        Object.entries(outputs)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n') + '\n'
    );
}
