import { join as pathJoin } from 'path';
import chalk from 'chalk';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import { postNgBuild } from './shared/postNgBuild';
import { cleanup } from './shared/cleanup';
import { run } from './shared/run';

console.log(chalk.cyan(`Building @keycloakify/angular...`));

const startTime = Date.now();

const distDirPath = pathJoin(getThisCodebaseRootDirPath(), 'dist');

cleanup({ distDirPath });

run('npx ng build', { cwd: getThisCodebaseRootDirPath() });

postNgBuild();

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
