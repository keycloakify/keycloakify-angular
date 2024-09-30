import * as fs from "fs";
import { join as pathJoin, basename as pathBasename } from "path";
import { transformCodebase } from "../tools/transformCodebase";
import chalk from "chalk";
import { run } from "../shared/run";
import { getThisCodebaseRootDirPath } from "../tools/getThisCodebaseRootDirPath";

(async () => {
    console.log(chalk.cyan("Building Keycloakify..."));

    const startTime = Date.now();

    const distDirPath = pathJoin(getThisCodebaseRootDirPath(), "dist");

    if (fs.existsSync(distDirPath)) {
        fs.rmSync(distDirPath, { recursive: true, force: true });
    }

    // Compile for angular
    {
        const angularWorkspaceDirPath = pathJoin(distDirPath, "workspace");

        transformCodebase({
            srcDirPath: pathJoin(__dirname, "workspace"),
            destDirPath: angularWorkspaceDirPath
        });

        transformCodebase({
            srcDirPath: pathJoin(getThisCodebaseRootDirPath(), "src"),
            destDirPath: pathJoin(
                angularWorkspaceDirPath,
                "projects",
                "keycloakify-angular",
                "src"
            )
        });

        //run(`yarn`, { cwd: angularWorkspaceDirPath });
        run(`yarn build`, { cwd: angularWorkspaceDirPath });

        const angularDistDirPath = pathJoin(
            angularWorkspaceDirPath,
            "dist",
            "keycloakify-angular"
        );

        transformCodebase({
            srcDirPath: pathJoin(angularDistDirPath, "esm2022"),
            destDirPath: distDirPath,
            transformSourceCode: ({ fileRelativePath, sourceCode }) => {
                if (pathBasename(fileRelativePath) === "keycloakify-angular.mjs") {
                    return undefined;
                }

                return { modifiedSourceCode: sourceCode };
            }
        });

        transformCodebase({
            srcDirPath: angularDistDirPath,
            destDirPath: distDirPath,
            transformSourceCode: ({ fileRelativePath, sourceCode }) => {
                if (fileRelativePath.startsWith("esm2022")) {
                    return undefined;
                }

                if (fileRelativePath.startsWith("fesm2022")) {
                    return undefined;
                }

                if (!fileRelativePath.endsWith(".d.ts")) {
                    return undefined;
                }

                return { modifiedSourceCode: sourceCode };
            }
        });

        fs.rmSync(angularWorkspaceDirPath, { recursive: true, force: true });

        if (Date.now() > 0) {
            process.exit(0);
        }
    }

    /*
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
    */

    run(`npx tsc-alias -p ${pathJoin("src", "tsconfig.json")}`);

    {
        const dirBasename = "src";

        const destDirPath = pathJoin("dist", dirBasename);

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
