import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import cliSelect from 'cli-select';
import * as fs from 'fs';
import { join as pathJoin, relative as pathRelative, dirname as pathDirname } from 'path';
import { assert, Equals } from 'tsafe/assert';
import chalk from 'chalk';
import { runPrettier, getIsPrettierAvailable } from './tools/runPrettier';
import {
    type BuildContext,
    LOGIN_THEME_PAGE_IDS,
    ACCOUNT_THEME_PAGE_IDS,
    type LoginThemePageId,
    type AccountThemePageId,
    THEME_TYPES
} from './core';

export async function command(params: { buildContext: BuildContext }) {
    const { buildContext } = params;

    console.log(chalk.cyan('Theme type:'));

    const themeType = await (async () => {
        const values = THEME_TYPES.filter(themeType => {
            switch (themeType) {
                case 'account':
                    return buildContext.implementedThemeTypes.account.isImplemented;
                case 'login':
                    return buildContext.implementedThemeTypes.login.isImplemented;
            }
            assert<Equals<typeof themeType, never>>(false);
        });

        assert(values.length > 0, 'No theme is implemented in this project');

        if (values.length === 1) {
            return values[0];
        }

        const { value } = await cliSelect({
            values
        }).catch(() => {
            process.exit(-1);
        });

        return value;
    })();

    console.log(`→ ${themeType}`);

    console.log(chalk.cyan('Select the page you want to create a Storybook for:'));

    const { value: pageId } = await cliSelect<LoginThemePageId | AccountThemePageId>({
        values: (() => {
            switch (themeType) {
                case 'login':
                    return [...LOGIN_THEME_PAGE_IDS];
                case 'account':
                    return [...ACCOUNT_THEME_PAGE_IDS];
            }
            assert<Equals<typeof themeType, never>>(false);
        })()
    }).catch(() => {
        process.exit(-1);
    });

    console.log(`→ ${pageId}`);

    const componentBasename = pageId.replace(/ftl$/, 'stories.ts');

    const targetFilePath = pathJoin(
        buildContext.themeSrcDirPath,
        themeType,
        'pages',
        pageId.replace(/\.ftl$/, ''),
        componentBasename
    );

    if (fs.existsSync(targetFilePath)) {
        console.log(`${pathRelative(process.cwd(), targetFilePath)} already exists`);

        process.exit(-1);
    }

    let sourceCode = fs
        .readFileSync(
            pathJoin(
                getThisCodebaseRootDirPath(),
                'stories',
                themeType,
                'pages',
                componentBasename
            )
        )
        .toString('utf8')
        .replace(/["']\.\.\/KcPageStory["']/, "'../../KcPageStory'");

    run_prettier: {
        if (!(await getIsPrettierAvailable())) {
            break run_prettier;
        }

        sourceCode = await runPrettier({
            filePath: targetFilePath,
            sourceCode: sourceCode
        });
    }

    {
        const targetDirPath = pathDirname(targetFilePath);

        if (!fs.existsSync(targetDirPath)) {
            fs.mkdirSync(targetDirPath, { recursive: true });
        }
    }

    fs.writeFileSync(targetFilePath, Buffer.from(sourceCode, 'utf8'));

    console.log(
        [
            `${chalk.green('✓')} ${chalk.bold(
                pathJoin('.', pathRelative(process.cwd(), targetFilePath))
            )} copy pasted from the Keycloakify source code into your project`,
            `You can start storybook with ${chalk.bold('npm run storybook')}`
        ].join('\n')
    );
}
