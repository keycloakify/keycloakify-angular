import { join as pathJoin } from 'path';
import { transformCodebase } from './tools/transformCodebase';
import chalk from 'chalk';
import * as child_process from 'child_process';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import { postNgBuild } from './shared/postNgBuild';
import { cleanup } from './shared/cleanup';

console.log(chalk.cyan(`Building @keycloakify/angular...`));

const startTime = Date.now();

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

cleanup({ distDirPath });

{
    const command = 'npx ng build';

    console.log(chalk.grey(`$ ${command}`));

    child_process.execSync(command, {
        stdio: 'inherit',
        cwd: getThisCodebaseRootDirPath()
    });
}

postNgBuild();

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
