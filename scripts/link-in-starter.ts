import * as fs from 'fs';
import { join as pathJoin, sep as pathSep } from 'path';
import { startRebuildOnSrcChange } from './shared/startRebuildOnSrcChange';
import { crawl } from './tools/crawl';
import { run } from './shared/run';
import cliSelect from 'cli-select';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import chalk from 'chalk';
import { removeNodeModules } from './tools/removeNodeModules';

(async () => {
    const parentDirPath = pathJoin(getThisCodebaseRootDirPath(), '..');

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

    const startTime = Date.now();

    console.log(chalk.cyan(`\n\nLinking in ..${pathSep}${starterName}...`));

    removeNodeModules({
        nodeModulesDirPath: pathJoin(getThisCodebaseRootDirPath(), 'node_modules')
    });

    fs.rmSync('dist', { recursive: true, force: true });
    fs.rmSync('.yarn_home', { recursive: true, force: true });

    run('yarn install');
    run('yarn build');

    const starterDirPath = pathJoin(parentDirPath, starterName);

    removeNodeModules({
        nodeModulesDirPath: pathJoin(starterDirPath, 'node_modules')
    });

    run('yarn install', { cwd: pathJoin('..', starterName) });

    run(`npx tsx ${pathJoin('scripts', 'link-in-app.ts')} ${starterName}`);

    startRebuildOnSrcChange();

    console.log(
        chalk.green(
            `\n\nLinked in ${starterName} in ${Math.round((Date.now() - startTime) / 1000)}s`
        )
    );
})();
