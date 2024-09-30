import * as fs from 'fs';
import { join as pathJoin, basename as pathBasename } from 'path';
import { transformCodebase } from '../tools/transformCodebase';
import chalk from 'chalk';
import { run } from '../shared/run';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';
import { crawl } from '../tools/crawl';

(async () => {
    console.log(chalk.cyan('Building Keycloakify...'));

    const startTime = Date.now();

    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

    if (fs.existsSync(distDirPath)) {
        fs.rmSync(distDirPath, { recursive: true, force: true });
    }

    // tsc + angular JIT
    {
        const angularWorkspaceDirPath = pathJoin(distDirPath, 'workspace');

        transformCodebase({
            srcDirPath: pathJoin(__dirname, 'workspace'),
            destDirPath: angularWorkspaceDirPath
        });

        const srcDirPath_workspace = pathJoin(
            angularWorkspaceDirPath,
            'projects',
            'keycloakify-angular',
            'src'
        );

        transformCodebase({
            srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'src'),
            destDirPath: srcDirPath_workspace
        });

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

        run(`yarn build`, { cwd: angularWorkspaceDirPath });

        const angularDistDirPath = pathJoin(
            angularWorkspaceDirPath,
            'dist',
            'keycloakify-angular'
        );

        transformCodebase({
            srcDirPath: pathJoin(angularDistDirPath, 'esm2022'),
            destDirPath: distDirPath,
            transformSourceCode: ({ fileRelativePath, sourceCode }) => {
                if (pathBasename(fileRelativePath) === 'keycloakify-angular.mjs') {
                    return undefined;
                }

                return { modifiedSourceCode: sourceCode };
            }
        });

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

                return { modifiedSourceCode: sourceCode };
            }
        });

        fs.rmSync(angularWorkspaceDirPath, { recursive: true, force: true });
    }

    run(`npx tsc-alias -p ${pathJoin('src', 'tsconfig.json')}`);

    {
        const dirBasename = 'src';

        const destDirPath = pathJoin('dist', dirBasename);

        fs.rmSync(destDirPath, { recursive: true, force: true });

        fs.cpSync(dirBasename, destDirPath, { recursive: true });
    }

    transformCodebase({
        srcDirPath: pathJoin(getThisCodebaseRootDirPath(), 'stories'),
        destDirPath: pathJoin(getThisCodebaseRootDirPath(), 'dist', 'stories'),
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (!fileRelativePath.endsWith('.stories.tsx')) {
                return undefined;
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    console.log(
        chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
    );
})();
