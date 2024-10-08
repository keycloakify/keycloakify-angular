import * as fs from 'fs';
import { join as pathJoin, sep as pathSep } from 'path';
import { run } from './shared/run';
import cliSelect from 'cli-select';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import chalk from 'chalk';
import { removeNodeModules } from './tools/removeNodeModules';
import * as child_process from 'child_process';
import { Deferred } from './tools/Deferred';

(async () => {
    const parentDirPath = pathJoin(getThisCodebaseRootDirPath(), '..');

    const { starterName } = await (async () => {
        const starterNames = fs
            .readdirSync(parentDirPath)
            .filter(
                basename =>
                    basename.includes('starter') &&
                    basename.includes('angular') &&
                    fs.statSync(pathJoin(parentDirPath, basename)).isDirectory()
            );

        if (starterNames.length === 0) {
            console.log(
                chalk.red(
                    `No starter found. Keycloakify Angular starter found in ${parentDirPath}`
                )
            );
            process.exit(-1);
        }

        const starterName = await (async () => {
            if (starterNames.length === 1) {
                return starterNames[0];
            }

            console.log(chalk.cyan(`\nSelect a starter to link in:`));

            const { value } = await cliSelect<string>({
                values: starterNames.map(starterName => `..${pathSep}${starterName}`)
            }).catch(() => {
                process.exit(-1);
            });

            return value.split(pathSep)[1];
        })();

        return { starterName };
    })();

    const startTime = Date.now();

    console.log(chalk.cyan(`\n\nLinking in ..${pathSep}${starterName}...`));

    removeNodeModules({
        nodeModulesDirPath: pathJoin(getThisCodebaseRootDirPath(), 'node_modules')
    });

    fs.rmSync(pathJoin(getThisCodebaseRootDirPath(), 'dist'), {
        recursive: true,
        force: true
    });
    fs.rmSync(pathJoin(getThisCodebaseRootDirPath(), '.yarn_home'), {
        recursive: true,
        force: true
    });

    run('yarn install');

    const dInitialCompilationCompleted = new Deferred<void>();

    {
        const child = child_process.spawn(
            'npx',
            ['tsx', pathJoin(getThisCodebaseRootDirPath(), 'scripts', 'watch.ts')],
            {
                shell: true,
                cwd: getThisCodebaseRootDirPath()
            }
        );

        const NG_BUILD_WATCHING_FOR_FILE_CHANGES = 'Watching for file changes';

        const onData = (data: Buffer) => {
            if (!data.toString('utf8').includes(NG_BUILD_WATCHING_FOR_FILE_CHANGES)) {
                process.stdout.write(data);
                return;
            }

            child.stdout.off('data', onData);

            child.stdout.on('data', data => process.stdout.write(data));

            dInitialCompilationCompleted.resolve();
        };

        child.stdout.on('data', onData);

        child.stderr.on('data', data => process.stderr.write(data));

        child.on('exit', code => process.exit(code ?? 0));
    }

    await dInitialCompilationCompleted.pr;

    const starterDirPath = pathJoin(parentDirPath, starterName);

    removeNodeModules({
        nodeModulesDirPath: pathJoin(starterDirPath, 'node_modules')
    });

    run('yarn install', { cwd: pathJoin('..', starterName) });

    run(`npx tsx ${pathJoin('scripts', 'link-in-app.ts')} ${starterName}`);

    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(chalk.green(`\n\nLinked in ${starterName} in ${durationSeconds}s`));
})();
