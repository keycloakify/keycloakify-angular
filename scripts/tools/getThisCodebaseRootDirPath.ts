import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function getThisCodebaseRootDirPath_rec(dirPath: string): string {
    if (fs.existsSync(path.join(dirPath, 'package.json'))) {
        return dirPath;
    }
    return getThisCodebaseRootDirPath_rec(path.join(dirPath, '..'));
}

let result: string | undefined = undefined;

export function getThisCodebaseRootDirPath(): string {
    if (result !== undefined) {
        return result;
    }

    return (result = getThisCodebaseRootDirPath_rec(__dirname));
}
