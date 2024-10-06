import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import chalk from 'chalk';
import * as child_process from 'child_process';
import chokidar from 'chokidar';
import { join as pathJoin } from 'path';
import { createWaitForThrottle } from './tools/waitForThrottle';
import { postNgBuild as postNgBuild_base } from './shared/postNgBuild';
import { cleanup } from './shared/cleanup';
import { EventEmitter } from 'events';
import * as fs from 'fs';

(async () => {
    const startTime = Date.now();

    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

    cleanup({ distDirPath });

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
            'npx',
            ['ng', 'build', '--watch', '--configuration', 'development'],
            {
                shell: true,
                cwd: getThisCodebaseRootDirPath()
            }
        );

        child.stdout.on('data', data => {
            if (data.toString('utf8').includes('Watching for file changes')) {
                eeNgBuildComplete.emit('');
                return;
            }

            process.stdout.write(data);
        });

        child.stderr.on('data', data => process.stderr.write(data));

        child.on('exit', code => process.exit(code ?? 0));
    }

    eeNgBuildComplete.on('', () => postNgBuild());

    await new Promise(resolve => eeNgBuildComplete.once('', resolve));

    const { waitForThrottle } = createWaitForThrottle({ delay: 400 });

    chokidar
        .watch(
            ['bin', 'stories'].map(relativePath =>
                pathJoin(getThisCodebaseRootDirPath(), 'src', relativePath)
            ),
            { ignoreInitial: true }
        )
        .on('all', async (event, path) => {
            console.log(chalk.bold(`${event}: ${path}`));

            await waitForThrottle();

            postNgBuild();
        });
})();
