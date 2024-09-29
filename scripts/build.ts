import * as fs from "fs";
import { join } from "path";
import { transformCodebase } from "./tools/transformCodebase";
import chalk from "chalk";
import { run } from "./shared/run";

(async () => {
    console.log(chalk.cyan("Building Keycloakify..."));

    const startTime = Date.now();

    run(`npx tsc -p ${join("src", "tsconfig.json")}`);

    transformCodebase({
        srcDirPath: join("src"),
        destDirPath: join("dist"),
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (!fileRelativePath.endsWith(".html")) {
                return undefined;
            }

            return { modifiedSourceCode: sourceCode };
        }
    });

    run(`npx tsc-alias -p ${join("src", "tsconfig.json")}`);

    {
        const dirBasename = "src";

        const destDirPath = join("dist", dirBasename);

        fs.rmSync(destDirPath, { recursive: true, force: true });

        fs.cpSync(dirBasename, destDirPath, { recursive: true });
    }

    /*
    transformCodebase({
        srcDirPath: join("stories"),
        destDirPath: join("dist", "stories"),
        transformSourceCode: ({ fileRelativePath, sourceCode }) => {
            if (!fileRelativePath.endsWith(".stories.tsx")) {
                return undefined;
            }

            return { modifiedSourceCode: sourceCode };
        }
    });
    */

    console.log(
        chalk.green(`✓ built in ${((Date.now() - startTime) / 1000).toFixed(2)}s`)
    );
})();
