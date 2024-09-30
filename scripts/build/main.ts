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

    fs.readdirSync(distDirPath).forEach(basename => {
        if (basename === 'package.json') {
            return;
        }
        fs.rmSync(pathJoin(distDirPath, basename), { recursive: true, force: true });
    });

    // tsc + angular JIT
    {
        const angularWorkspaceDirPath = pathJoin(distDirPath, 'workspace');

        if (fs.existsSync(angularWorkspaceDirPath)) {
            fs.rmSync(angularWorkspaceDirPath, { recursive: true, force: true });
        }

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

        run(`npx ng build`, { cwd: angularWorkspaceDirPath });

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

                if (fileRelativePath === 'public-api.mjs') {
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

                if (fileRelativePath === 'index.d.ts') {
                    return undefined;
                }

                if (fileRelativePath === 'public-api.d.ts') {
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
            if (!fileRelativePath.endsWith('.stories.ts')) {
                return undefined;
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    bump_dev_package_json_version: {
        const devPackageJsonFilePath = pathJoin(distDirPath, 'package.json');

        if (!fs.existsSync(devPackageJsonFilePath)) {
            break bump_dev_package_json_version;
        }

        const devPackageJson = JSON.parse(
            fs.readFileSync(devPackageJsonFilePath).toString('utf8')
        );

        devPackageJson.version = `0.0.0-rc.${Date.now()}`;

        fs.writeFileSync(
            devPackageJsonFilePath,
            Buffer.from(JSON.stringify(devPackageJson, null, 2))
        );
    }

    console.log(
        chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
    );
})();
