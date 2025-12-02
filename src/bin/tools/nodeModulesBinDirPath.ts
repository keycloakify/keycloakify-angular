import { dirname as pathDirname, join as pathJoin, sep as pathSep } from 'path';
import { getNearestPackageJsonDirPath } from './getThisCodebaseRootDirPath';

let cache: string | undefined = undefined;

/** NOTE: Careful, this function can fail when the binary
 *  Used is not in the node_modules directory of the project
 * (for example when running tests with vscode extension we'll get
 * '/Users/dylan/.vscode/extensions/vitest.explorer-1.16.0/dist/worker.js'
 *
 * instead of
 * '/Users/joseph/.nvm/versions/node/v22.12.0/bin/node'
 * or
 * '/Users/joseph/github/keycloakify-starter/node_modules/.bin/vite'
 *
 * as the value of process.argv[1]
 */
export function getNodeModulesBinDirPath() {
    if (cache !== undefined) {
        return cache;
    }

    const binPath = process.argv[1];

    special_case_running_not_from_distribution: {
        if (!binPath.endsWith('.ts')) {
            break special_case_running_not_from_distribution;
        }

        const packageJsonDirPath = getNearestPackageJsonDirPath(pathDirname(binPath));

        const nodeModulesBinDirPath = pathJoin(
            packageJsonDirPath,
            'node_modules',
            '.bin'
        );

        return nodeModulesBinDirPath;
    }

    const segments: string[] = ['.bin'];

    let foundNodeModules = false;

    for (const segment of binPath.split(pathSep).reverse()) {
        skip_segment: {
            if (foundNodeModules) {
                break skip_segment;
            }

            if (segment === 'node_modules') {
                foundNodeModules = true;
                break skip_segment;
            }

            continue;
        }

        segments.unshift(segment);
    }

    if (!foundNodeModules) {
        throw new Error(`Could not find node_modules in path ${binPath}`);
    }

    const nodeModulesBinDirPath = segments.join(pathSep);

    cache = nodeModulesBinDirPath;

    return nodeModulesBinDirPath;
}
