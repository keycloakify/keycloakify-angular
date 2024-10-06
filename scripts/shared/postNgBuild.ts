import * as fs from 'fs';
import {
    join as pathJoin,
    basename as pathBasename,
    relative as pathRelative,
    sep as pathSep,
    dirname as pathDirname
} from 'path';
import { transformCodebase } from '../../src/bin/tools/transformCodebase';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';
import { run } from './run';
import { BIN_NAME } from 'keycloakify/bin/shared/customHandler';

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

export function postNgBuild() {
    copyTransformSrcDirToDist();

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
    const binDirPath = pathJoin(getThisCodebaseRootDirPath(), 'src', 'bin');
    const distDirPath_bin = pathJoin(distDirPath, 'bin');

    run(`npx tsc -p ${binDirPath} --outDir ${distDirPath_bin}`);

    const nccOutDirPath = pathJoin(distDirPath_bin, 'ncc_out');

    const entrypointFilePath = pathJoin(distDirPath_bin, 'main.js');

    run(`npx ncc build ${entrypointFilePath} -o ${nccOutDirPath}`);

    transformCodebase({
        srcDirPath: distDirPath_bin,
        destDirPath: distDirPath_bin,
        transformSourceCode: ({ filePath, sourceCode }) => {
            if (filePath.startsWith(nccOutDirPath)) {
                return { modifiedSourceCode: sourceCode };
            }

            return undefined;
        }
    });

    fs.readdirSync(nccOutDirPath).forEach(basename => {
        const destFilePath =
            basename === 'index.js'
                ? entrypointFilePath
                : pathJoin(pathDirname(entrypointFilePath), basename);
        const srcFilePath = pathJoin(nccOutDirPath, basename);

        fs.cpSync(srcFilePath, destFilePath);
    });

    fs.rmSync(nccOutDirPath, { recursive: true });

    fs.chmodSync(
        entrypointFilePath,
        fs.statSync(entrypointFilePath).mode |
            fs.constants.S_IXUSR |
            fs.constants.S_IXGRP |
            fs.constants.S_IXOTH
    );

    return {
        packageJsonBinProperty: {
            [BIN_NAME]: pathRelative(distDirPath, entrypointFilePath).replaceAll(
                pathSep,
                '/'
            )
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
                return undefined;
            }

            if (fileRelativePath.endsWith('public-api.ts')) {
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

    for (const themeType of ['login', 'account']) {
        const dirPath = pathJoin(srcDirPath_dist, themeType);

        transformCodebase({
            srcDirPath: dirPath,
            destDirPath: dirPath,
            transformSourceCode: ({ fileRelativePath, sourceCode }) => {
                if (!fileRelativePath.endsWith('.ts')) {
                    return { modifiedSourceCode: sourceCode };
                }

                let modifiedSourceCode_str = sourceCode.toString();

                const getRelativeTo = (relativePath: string) =>
                    pathRelative(pathDirname(fileRelativePath), relativePath).replaceAll(
                        pathSep,
                        '/'
                    );

                modifiedSourceCode_str = modifiedSourceCode_str.replaceAll(
                    `@keycloakify/angular/${themeType}/i18n`,
                    getRelativeTo('i18n') === 'i18n' ? './i18n' : getRelativeTo('i18n')
                );

                modifiedSourceCode_str = modifiedSourceCode_str.replaceAll(
                    `@keycloakify/angular/${themeType}/KcContext`,
                    getRelativeTo('KcContext') === 'KcContext'
                        ? './KcContext'
                        : getRelativeTo('KcContext')
                );

                return {
                    modifiedSourceCode: Buffer.from(modifiedSourceCode_str, 'utf8')
                };
            }
        });
    }
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
