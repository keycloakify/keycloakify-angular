import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function getThisCodebaseRootDirPath_rec(dirPath: string): string {
    if (fs.existsSync(path.join(dirPath, 'LICENSE'))) {
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
