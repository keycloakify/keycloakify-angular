import * as fs from 'fs';
import {
    join as pathJoin,
    basename as pathBasename,
    relative as pathRelative,
    sep as pathSep,
    dirname as pathDirname
} from 'path';
import { transformCodebase } from './tools/transformCodebase';
import chalk from 'chalk';
import * as child_process from 'child_process';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';

(async () => {
    console.log(chalk.cyan('Building @keycloakify/angular...'));

    const startTime = Date.now();

    {
        const command = `npx ng build`;

        console.log(chalk.grey(`$ ${command}`));

        child_process.execSync(command, {
            stdio: 'inherit',
            cwd: getThisCodebaseRootDirPath()
        });
    }

    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

    const srcDirPath_dist = pathJoin(distDirPath, 'src');

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'src'),
        destDirPath: srcDirPath_dist,
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (fileRelativePath.endsWith('ng-package.json')) {
                return undefined;
            }

            if (fileRelativePath.endsWith('public-api.ts')) {
                return undefined;
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
                    getRelativeTo('i18n')
                );

                modifiedSourceCode_str = modifiedSourceCode_str.replaceAll(
                    `@keycloakify/angular/${themeType}/KcContext`,
                    getRelativeTo('KcContext')
                );

                return {
                    modifiedSourceCode: Buffer.from(modifiedSourceCode_str, 'utf8')
                };
            }
        });
    }

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'stories'),
        destDirPath: pathJoin(distDirPath, 'stories')
    });

    for (const basename of ['README.md', 'LICENSE']) {
        fs.cpSync(
            pathJoin(getThisCodebaseRootDirPath(), basename),
            pathJoin(distDirPath, basename)
        );
    }

    {
        const packageJsonParsed = JSON.parse(
            fs
                .readFileSync(pathJoin(getThisCodebaseRootDirPath(), 'package.json'))
                .toString('utf8')
        );

        const packageJsonFilePath_dist = pathJoin(distDirPath, 'package.json');

        const packageJsonParsed_dist = JSON.parse(
            fs.readFileSync(packageJsonFilePath_dist).toString('utf8')
        );

        packageJsonParsed_dist.version = packageJsonParsed.version;

        fs.writeFileSync(
            packageJsonFilePath_dist,
            JSON.stringify(packageJsonParsed_dist, null, 2)
        );
    }

    console.log(
        chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
    );
})();
