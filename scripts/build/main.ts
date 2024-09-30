import * as fs from 'fs';
import { join as pathJoin, basename as pathBasename } from 'path';
import { transformCodebase } from '../tools/transformCodebase';
import chalk from 'chalk';
import { run } from '../shared/run';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';
import { crawl } from '../tools/crawl';

(async () => {
    console.log(chalk.cyan('Building @keycloakify/angular...'));

    const startTime = Date.now();

    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

    // tsc + angular JIT
    {
        const angularWorkspaceDirPath = pathJoin(distDirPath, 'workspace');

        console.log('a');

        if (fs.existsSync(distDirPath)) {
            fs.rmSync(distDirPath, { recursive: true, force: true });
        }

        console.log('b');

        transformCodebase({
            srcDirPath: pathJoin(__dirname, 'workspace'),
            destDirPath: angularWorkspaceDirPath
        });

        console.log('c');

        const srcDirPath_workspace = pathJoin(
            angularWorkspaceDirPath,
            'projects',
            'keycloakify-angular',
            'src'
        );

        console.log('e');

        transformCodebase({
            srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'src'),
            destDirPath: srcDirPath_workspace
        });

        console.log('f');

        {
            const typescriptFilesRelativeFilePaths = crawl({
                dirPath: pathJoin(getThisCodebaseRootDirPath(), 'src'),
                returnedPathsType: 'relative to dirPath'
            }).filter(relativePath => relativePath.endsWith('.ts'));

            fs.writeFileSync(
                pathJoin(srcDirPath_workspace, 'public-api.ts'),
                Buffer.from(
                    typescriptFilesRelativeFilePaths
                        .map(
                            (relativeFilePath, i) =>
                                `export * as e${i} from "./${relativeFilePath.replace(/\.ts$/, '')}";`
                        )
                        .join('\n')
                )
            );
        }

        console.log('g');

        run(`npx ng build`, { cwd: angularWorkspaceDirPath });

        console.log('h');

        const angularDistDirPath = pathJoin(
            angularWorkspaceDirPath,
            'dist',
            'keycloakify-angular'
        );

        console.log('i');

        transformCodebase({
            srcDirPath: pathJoin(angularDistDirPath, 'esm2022'),
            destDirPath: distDirPath,
            transformSourceCode: ({ fileRelativePath, sourceCode }) => {
                if (pathBasename(fileRelativePath) === 'keycloakify-angular.mjs') {
                    return undefined;
                }

                if (fileRelativePath === 'public-api.mjs') {
                    return undefined;
                }

                return { modifiedSourceCode: sourceCode };
            }
        });

        console.log('j');

        transformCodebase({
            srcDirPath: angularDistDirPath,
            destDirPath: distDirPath,
            transformSourceCode: ({ fileRelativePath, sourceCode }) => {
                if (fileRelativePath.startsWith('esm2022')) {
                    return undefined;
                }

                if (fileRelativePath.startsWith('fesm2022')) {
                    return undefined;
                }

                if (!fileRelativePath.endsWith('.d.ts')) {
                    return undefined;
                }

                if (fileRelativePath === 'index.d.ts') {
                    return undefined;
                }

                if (fileRelativePath === 'public-api.d.ts') {
                    return undefined;
                }

                return { modifiedSourceCode: sourceCode };
            }
        });

        console.log('k');

        fs.rmSync(angularWorkspaceDirPath, { recursive: true, force: true });
    }

    console.log('l');

    run(`npx tsc-alias -p ${pathJoin('src', 'tsconfig.json')}`);

    console.log('m');

    {
        const dirBasename = 'src';

        const destDirPath = pathJoin('dist', dirBasename);

        fs.rmSync(destDirPath, { recursive: true, force: true });

        fs.cpSync(dirBasename, destDirPath, { recursive: true });
    }

    console.log('n');

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'stories'),
        destDirPath: pathJoin(getThisCodebaseRootDirPath(), 'dist', 'stories'),
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (!fileRelativePath.endsWith('.stories.ts')) {
                return undefined;
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    console.log('o');

    console.log(
        chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
    );
})();
