import * as fs from 'fs';
import { transformCodebase } from '../tools/transformCodebase';

export function cleanup(params: { distDirPath: string }) {
    const { distDirPath } = params;

    if (!fs.existsSync(distDirPath)) {
        return;
    }

    transformCodebase({
        srcDirPath: distDirPath,
        destDirPath: distDirPath,
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (fileRelativePath === 'package.json') {
                return { modifiedSourceCode: sourceCode };
            }

            return undefined;
        }
    });
}
