import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import chalk from 'chalk';
import * as child_process from 'child_process';
import chokidar from 'chokidar';
import { join as pathJoin } from 'path';
import { createWaitForThrottle } from './tools/waitForThrottle';
import { postNgBuild as postNgBuild_base } from './shared/postNgBuild';
import { EventEmitter } from 'events';
import * as fs from 'fs';

(async () => {
    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

    const postNgBuild = () => {
        postNgBuild_base();

        {
            const packageJsonFilePath = pathJoin(distDirPath, 'package.json');

            const parsedPackageJson = JSON.parse(
                fs.readFileSync(packageJsonFilePath).toString('utf8')
            ) as { version: string };

            parsedPackageJson.version = `0.0.0-rc.${Date.now()}`;

            fs.writeFileSync(
                packageJsonFilePath,
                Buffer.from(JSON.stringify(parsedPackageJson, null, 2), 'utf8')
            );
        }

        console.log('@keycloakify/angular Build complete');
        console.log(chalk.cyan(`@keycloakify/angular Watching for file changes...`));
    };

    const eeNgBuildComplete = new EventEmitter();

    {
        const child = child_process.spawn(
            'pnpm',
            ['exec', 'ng', 'build', '--watch', '--configuration', 'development'],
            {
                shell: true,
                cwd: getThisCodebaseRootDirPath()
            }
        );

        child.stdout.on('data', data => {
            process.stdout.write(data);

            if (data.toString('utf8').includes('Library bundle generation complete')) {
                eeNgBuildComplete.emit('');
            }
        });

        child.stderr.on('data', data => process.stderr.write(data));

        child.on('exit', code => process.exit(code ?? 0));
    }

    eeNgBuildComplete.on('', () => postNgBuild());

    await new Promise(resolve => eeNgBuildComplete.once('', resolve));

    const { waitForThrottle } = createWaitForThrottle({ delay: 400 });

    // The CLI in src/bin is not part of the Angular compilation, so ng build does not
    // watch it. Stories, README and LICENSE are builder assets and watched by ng build.
    chokidar
        .watch(pathJoin(getThisCodebaseRootDirPath(), 'src', 'bin'), {
            ignoreInitial: true
        })
        .on('all', async (event, path) => {
            console.log(chalk.bold(`${event}: ${path}`));

            await waitForThrottle();

            postNgBuild();
        });
})();
