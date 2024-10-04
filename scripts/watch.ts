import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import chalk from 'chalk';
import * as child_process from 'child_process';
import chokidar from 'chokidar';
import { join as pathJoin } from 'path';
import { createWaitForThrottle } from './tools/waitForThrottle';
import { postNgBuild } from './shared/postNgBuild';
import { cleanup } from './shared/cleanup';

(async () => {
    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

    cleanup({ distDirPath });

    {
        const child = child_process.spawn(
            'npx',
            ['ng', 'build', '--watch', '--configuration', 'development'],
            {
                shell: true,
                cwd: getThisCodebaseRootDirPath()
            }
        );

        child.stdout.on('data', data => process.stdout.write(data));

        child.stderr.on('data', data => process.stderr.write(data));

        child.on('exit', code => process.exit(code ?? 0));
    }

    const { waitForThrottle } = createWaitForThrottle({ delay: 400 });

    chokidar
        .watch(
            ['src', 'package.json'].map(relativePath =>
                pathJoin(getThisCodebaseRootDirPath(), relativePath)
            ),
            { ignoreInitial: true }
        )
        .on('all', async (event, path) => {
            console.log(chalk.bold(`${event}: ${path}`));

            await waitForThrottle();

            postNgBuild({ distDirPath });
        });
})();
