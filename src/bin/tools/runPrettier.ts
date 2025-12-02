/* eslint-disable @typescript-eslint/consistent-type-imports */
import chalk from 'chalk';
import * as crypto from 'crypto';
import * as fsPr from 'fs/promises';
import { join as pathJoin, resolve as pathResolve } from 'path';
import { assert, is } from 'tsafe/assert';
import { id } from 'tsafe/id';
import { symToStr } from 'tsafe/symToStr';
import { getNodeModulesBinDirPath } from './nodeModulesBinDirPath';

getIsPrettierAvailable.cache = id<boolean | undefined>(undefined);

export async function getIsPrettierAvailable(): Promise<boolean> {
    if (getIsPrettierAvailable.cache !== undefined) {
        return getIsPrettierAvailable.cache;
    }

    const nodeModulesBinDirPath = getNodeModulesBinDirPath();

    const prettierBinPath = pathJoin(nodeModulesBinDirPath, 'prettier');

    const stats = await fsPr.stat(prettierBinPath).catch(() => undefined);

    const isPrettierAvailable = stats?.isFile() ?? false;

    getIsPrettierAvailable.cache = isPrettierAvailable;

    return isPrettierAvailable;
}

type PrettierAndConfigHash = {
    prettier: typeof import('prettier');
    configHash: string;
};

getPrettier.cache = id<PrettierAndConfigHash | undefined>(undefined);

export async function getPrettier(): Promise<PrettierAndConfigHash> {
    assert(getIsPrettierAvailable());

    if (getPrettier.cache !== undefined) {
        return getPrettier.cache;
    }

    let prettier = id<typeof import('prettier') | undefined>(undefined);

    import_prettier: {
        const prettierDirPath = pathResolve(
            pathJoin(getNodeModulesBinDirPath(), '..', 'prettier')
        );

        const isCJS = typeof module !== 'undefined' && module.exports;

        if (isCJS) {
            eval(`${symToStr({ prettier })} = require("${prettierDirPath}")`);
        } else {
            prettier = await new Promise(_resolve => {
                eval(
                    `import("file:///${pathJoin(prettierDirPath, 'index.mjs').replace(/\\/g, '/')}").then(prettier => _resolve(prettier))`
                );
            });
        }

        assert(!is<undefined>(prettier));

        break import_prettier;
    }

    const configHash = await (async () => {
        const configFilePath = await prettier.resolveConfigFile(
            pathJoin(getNodeModulesBinDirPath(), '..', '..')
        );

        if (configFilePath === null) {
            return '';
        }

        const data = await fsPr.readFile(configFilePath);

        return crypto.createHash('sha256').update(data).digest('hex');
    })();

    const prettierAndConfig: PrettierAndConfigHash = {
        prettier,
        configHash
    };

    getPrettier.cache = prettierAndConfig;

    return prettierAndConfig;
}

export async function runPrettier(params: {
    sourceCode: string;
    filePath: string;
}): Promise<string>;
export async function runPrettier(params: {
    sourceCode: Buffer;
    filePath: string;
}): Promise<Buffer>;
export async function runPrettier(params: {
    sourceCode: string | Buffer;
    filePath: string;
}): Promise<string | Buffer> {
    const { sourceCode, filePath } = params;

    let formattedSourceCode: string;

    try {
        const { prettier } = await getPrettier();

        const { ignored, inferredParser } = await prettier.getFileInfo(filePath, {
            resolveConfig: true
        });

        if (ignored || inferredParser === null) {
            return sourceCode;
        }

        const config = await prettier.resolveConfig(filePath);

        formattedSourceCode = await prettier.format(
            typeof sourceCode === 'string' ? sourceCode : sourceCode.toString('utf8'),
            {
                ...config,
                filePath,
                parser: inferredParser
            }
        );
    } catch (error) {
        console.log(
            chalk.red(
                `You probably need to upgrade the version of prettier in your project`
            )
        );

        throw error;
    }

    return typeof sourceCode === 'string'
        ? formattedSourceCode
        : Buffer.from(formattedSourceCode, 'utf8');
}
