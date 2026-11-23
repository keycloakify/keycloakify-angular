import chalk from 'chalk';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import { postNgBuild } from './shared/postNgBuild';
import { run } from './shared/run';

console.log(chalk.cyan(`Building @keycloakify/angular...`));

const startTime = Date.now();

run('pnpm exec ng build', { cwd: getThisCodebaseRootDirPath() });

postNgBuild();

console.log(chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`));
