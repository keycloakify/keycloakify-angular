import * as fs from 'fs';
import {
    basename as pathBasename,
    join as pathJoin,
    relative as pathRelative,
    sep as pathSep
} from 'path';
import { BIN_NAME } from '../../src/bin/core';
import { transformCodebase } from '../../src/bin/tools/transformCodebase';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';
import { run } from './run';

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

export function postNgBuild() {
    copyTransformSrcDirToDist();

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'stories'),
        destDirPath: pathJoin(distDirPath, 'stories'),
        transformSourceCode: ({ filePath, sourceCode }) => {
            if (!filePath.endsWith('stories.ts')) {
                return undefined;
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    for (const basename of ['README.md', 'LICENSE']) {
        fs.cpSync(
            pathJoin(getThisCodebaseRootDirPath(), basename),
            pathJoin(distDirPath, basename)
        );
    }

    const { packageJsonBinProperty } = buildBin();

    preparePackageJson({ packageJsonBinProperty });
}

function buildBin() {
    const rootDirPath = getThisCodebaseRootDirPath();
    const distDirPath_bin = pathJoin(distDirPath, 'bin');

    fs.mkdirSync(distDirPath_bin, { recursive: true });

    const entrypointFilePath = pathJoin(rootDirPath, 'src', 'bin', 'main.ts');
    const outFilePath = pathJoin(distDirPath_bin, 'index.js');

    // ESM bundle needs a `require` for transitive `require()` of node built-ins
    // (e.g. cli-select's `require("readline")`). esbuild's __require shim throws
    // under pure ESM, so we restore `require` via createRequire, like ncc did.
    const banner =
        "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";

    // The `direct-eval` warning comes from the intentional `eval` in
    // runPrettier.ts, which loads the consumer project's prettier by absolute
    // path while hiding it from the bundler. It's deliberate, so silence it.
    run(
        `npx esbuild ${entrypointFilePath} --bundle --minify --external:prettier --platform=node --format=esm --log-override:direct-eval=silent --banner:js="${banner}" --outfile=${outFilePath}`
    );

    fs.chmodSync(
        outFilePath,
        fs.statSync(outFilePath).mode |
            fs.constants.S_IXUSR |
            fs.constants.S_IXGRP |
            fs.constants.S_IXOTH
    );

    return {
        packageJsonBinProperty: {
            [BIN_NAME]: pathRelative(distDirPath, outFilePath).replaceAll(pathSep, '/')
        }
    };
}

function copyTransformSrcDirToDist() {
    const srcDirPath_dist = pathJoin(distDirPath, 'src');

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'src'),
        destDirPath: srcDirPath_dist,
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (fileRelativePath.endsWith('ng-package.json')) {
                return undefined;
            }

            if (fileRelativePath.endsWith('package.json')) {
                return undefined;
            }

            if (fileRelativePath.endsWith('tsconfig.lib.json')) {
                return undefined;
            }

            if (fileRelativePath.endsWith('tsconfig.lib.prod.json')) {
                return undefined;
            }

            if (fileRelativePath.endsWith('index.ts')) {
                return {
                    newFileName: 'index.ts',
                    modifiedSourceCode: sourceCode
                };
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    const filePaths_toCreate: { filePath: string; content: Buffer }[] = [];

    (function callee(dirPath: string) {
        const basenames = fs.readdirSync(dirPath);

        const basenames_dirs = basenames.filter(basename =>
            fs.statSync(pathJoin(dirPath, basename)).isDirectory()
        );

        factorize: {
            if (basenames_dirs.length !== 0) {
                break factorize;
            }

            const basenames_files = basenames
                .filter(basename => fs.statSync(pathJoin(dirPath, basename)).isFile())
                .filter(basename => basename !== 'index.ts');

            if (basenames_files.length !== 1) {
                break factorize;
            }

            const [basename_file] = basenames_files;

            if (pathBasename(dirPath) !== basename_file.replace(/\.ts$/, '')) {
                break factorize;
            }

            filePaths_toCreate.push({
                filePath: `${dirPath}.ts`,
                content: fs.readFileSync(pathJoin(dirPath, basenames_files[0]))
            });

            return;
        }

        basenames_dirs.forEach(basename_dir => {
            callee(pathJoin(dirPath, basename_dir));
        });
    })(distDirPath);

    filePaths_toCreate.forEach(({ filePath, content }) => {
        fs.rmSync(filePath.replace(/\.ts$/, ''), { recursive: true });

        fs.writeFileSync(filePath, content);
    });
}

function preparePackageJson(params: { packageJsonBinProperty: Record<string, string> }) {
    const { packageJsonBinProperty } = params;

    const packageJsonParsed = JSON.parse(
        fs
            .readFileSync(pathJoin(getThisCodebaseRootDirPath(), 'package.json'))
            .toString('utf8')
    );

    const packageJsonFilePath_dist = pathJoin(distDirPath, 'package.json');

    const packageJsonParsed_dist = JSON.parse(
        fs.readFileSync(packageJsonFilePath_dist).toString('utf8')
    );

    for (const propertyName of [
        'version',
        'description',
        'keywords',
        'author',
        'license',
        'repository',
        'homepage'
    ]) {
        packageJsonParsed_dist[propertyName] = packageJsonParsed[propertyName];
    }

    packageJsonParsed_dist.bin = packageJsonBinProperty;

    fs.writeFileSync(
        packageJsonFilePath_dist,
        JSON.stringify(packageJsonParsed_dist, null, 2)
    );
}
