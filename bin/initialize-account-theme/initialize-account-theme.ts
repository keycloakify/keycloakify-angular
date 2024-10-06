import type { BuildContext } from '../core';
import child_process from 'child_process';
import chalk from 'chalk';
import { join as pathJoin, relative as pathRelative } from 'path';
import * as fs from 'fs';
import { updateAccountThemeImplementationInConfig } from './updateAccountThemeImplementationInConfig';
import { command as updateKcGenCommand } from '../update-kc-gen';
import { getThisCodebaseRootDirPath } from '../tools/getThisCodebaseRootDirPath';

export async function command(params: { buildContext: BuildContext }) {
    const { buildContext } = params;

    const accountThemeSrcDirPath = pathJoin(buildContext.themeSrcDirPath, 'account');

    if (
        fs.existsSync(accountThemeSrcDirPath) &&
        fs.readdirSync(accountThemeSrcDirPath).length > 0
    ) {
        console.warn(
            chalk.red(
                `There is already a ${pathRelative(
                    process.cwd(),
                    accountThemeSrcDirPath
                )} directory in your project. Aborting.`
            )
        );

        process.exit(-1);
    }

    exit_if_uncommitted_changes: {
        let hasUncommittedChanges: boolean | undefined = undefined;

        try {
            hasUncommittedChanges =
                child_process
                    .execSync(`git status --porcelain`, {
                        cwd: buildContext.projectDirPath
                    })
                    .toString()
                    .trim() !== '';
        } catch {
            // Probably not a git repository
            break exit_if_uncommitted_changes;
        }

        if (!hasUncommittedChanges) {
            break exit_if_uncommitted_changes;
        }
        console.warn(
            [
                chalk.red(
                    'Please commit or stash your changes before running this command.\n'
                ),
                "This command will modify your project's files so it's better to have a clean working directory",
                'so that you can easily see what has been changed and revert if needed.'
            ].join(' ')
        );

        process.exit(-1);
    }

    const accountThemeType = 'Multi-Page';

    fs.cpSync(
        pathJoin(
            getThisCodebaseRootDirPath(),
            'src',
            'bin',
            'initialize-account-theme',
            'boilerplate'
        ),
        accountThemeSrcDirPath,
        { recursive: true }
    );

    updateAccountThemeImplementationInConfig({ buildContext, accountThemeType });

    updateKcGenCommand({
        buildContext: {
            ...buildContext,
            implementedThemeTypes: {
                ...buildContext.implementedThemeTypes,
                account: {
                    isImplemented: true,
                    type: accountThemeType
                }
            }
        }
    });

    console.log(
        [
            chalk.green(`The ${accountThemeType} account theme has been initialized.`),
            `Directory created: ${chalk.bold(pathRelative(process.cwd(), accountThemeSrcDirPath))}`
        ].join('\n')
    );
}
