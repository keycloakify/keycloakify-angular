import { execSync } from 'child_process';
import { join as pathJoin, relative as pathRelative } from 'path';
import { getThisCodebaseRootDirPath } from './tools/getThisCodebaseRootDirPath';
import * as fs from 'fs';
import * as os from 'os';

const singletonDependencies: string[] = ['keycloakify', 'rxjs', 'tslib', 'typescript'];

// For example [ "@emotion" ] it's more convenient than
// having to list every sub emotion packages (@emotion/css @emotion/utils ...)
// in singletonDependencies
const namespaceSingletonDependencies: string[] = ['@angular'];

const rootDirPath = getThisCodebaseRootDirPath();

const commonThirdPartyDeps = [
    ...namespaceSingletonDependencies
        .map(namespaceModuleName =>
            fs
                .readdirSync(pathJoin(rootDirPath, 'node_modules', namespaceModuleName))
                .map(submoduleName => `${namespaceModuleName}/${submoduleName}`)
        )
        .reduce((prev, curr) => [...prev, ...curr], []),
    ...singletonDependencies
];

const yarnGlobalDirPath = pathJoin(rootDirPath, '.yarn_home');

fs.rmSync(yarnGlobalDirPath, { recursive: true, force: true });
fs.mkdirSync(yarnGlobalDirPath);

const execYarnLink = (params: { targetModuleName?: string; cwd: string }) => {
    const { targetModuleName, cwd } = params;

    if (targetModuleName === undefined) {
        const packageJsonFilePath = pathJoin(cwd, 'package.json');

        const packageJson = JSON.parse(
            fs.readFileSync(packageJsonFilePath).toString('utf8')
        );

        delete packageJson['packageManager'];

        fs.writeFileSync(
            packageJsonFilePath,
            Buffer.from(JSON.stringify(packageJson, null, 2))
        );
    }

    const cmd = [
        'yarn',
        'link',
        ...(targetModuleName !== undefined ? [targetModuleName] : ['--no-bin-links'])
    ].join(' ');

    console.log(`$ cd ${pathRelative(rootDirPath, cwd) || '.'} && ${cmd}`);

    execSync(cmd, {
        cwd,
        env: {
            ...process.env,
            ...(os.platform() === 'win32'
                ? {
                      USERPROFILE: yarnGlobalDirPath,
                      LOCALAPPDATA: yarnGlobalDirPath
                  }
                : { HOME: yarnGlobalDirPath })
        }
    });
};

const testAppPaths = (() => {
    const [, , ...testAppNames] = process.argv;

    return testAppNames
        .map(testAppName => {
            const testAppPath = pathJoin(rootDirPath, '..', testAppName);

            if (fs.existsSync(testAppPath)) {
                return testAppPath;
            }

            console.warn(
                `Skipping ${testAppName} since it cant be found here: ${testAppPath}`
            );

            return undefined;
        })
        .filter((path): path is string => path !== undefined);
})();

if (testAppPaths.length === 0) {
    console.error('No test app to link into!');
    process.exit(-1);
}

testAppPaths.forEach(testAppPath => execSync('yarn install', { cwd: testAppPath }));

console.log('=== Linking common dependencies ===');

const total = commonThirdPartyDeps.length;
let current = 0;

commonThirdPartyDeps.forEach(commonThirdPartyDep => {
    current++;

    console.log(`${current}/${total} ${commonThirdPartyDep}`);

    const localInstallPath = pathJoin(
        ...[
            rootDirPath,
            'node_modules',
            ...(commonThirdPartyDep.startsWith('@')
                ? commonThirdPartyDep.split('/')
                : [commonThirdPartyDep])
        ]
    );

    execYarnLink({ cwd: localInstallPath });
});

commonThirdPartyDeps.forEach(commonThirdPartyDep =>
    testAppPaths.forEach(testAppPath =>
        execYarnLink({
            cwd: testAppPath,
            targetModuleName: commonThirdPartyDep
        })
    )
);

console.log('=== Linking in house dependencies ===');

execYarnLink({ cwd: pathJoin(rootDirPath, 'dist') });

testAppPaths.forEach(testAppPath =>
    execYarnLink({
        cwd: testAppPath,
        targetModuleName: JSON.parse(
            fs.readFileSync(pathJoin(rootDirPath, 'package.json')).toString('utf8')
        )['name']
    })
);

testAppPaths.forEach(testAppPath => {
    const ngFilePath = pathJoin(testAppPath, 'node_modules', '.bin', 'ng');

    fs.rmSync(ngFilePath);

    fs.writeFileSync(
        ngFilePath,
        Buffer.from(
            `#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const { join: pathJoin } = require('path');

const [nodePath, , ...args] = process.argv;

(function callee() {

    remove_angular_cache: {

        const angularCacheDirPath = pathJoin(__dirname, "..", "..", ".angular", "cache");

        if( !fs.existsSync(angularCacheDirPath) ){
            break remove_angular_cache;
        }

        fs.rmSync(
            angularCacheDirPath,
            { recursive: true }
        );

    }

    const serverProcess = spawn(
        nodePath,
        [
            pathJoin(__dirname, "..", "@angular", "cli", "bin", "ng.js"),
            ...args
        ],
        { stdio: 'inherit' }
    );

    const getPackageJsonVersion = () => {
        const packageJson = JSON.parse(
            fs.readFileSync(
                pathJoin(__dirname, "..", "@keycloakify", "angular", "package.json"),
                "utf8"
            )
        );

        return packageJson.version;
    };

    let packageJsonVersion = getPackageJsonVersion();

    fs.watch(
        pathJoin(__dirname, "..", "@keycloakify", "angular", "package.json"),
        eventType => {

            if (eventType !== "change") {
                return;
            }

            const newPackageJsonVersion = getPackageJsonVersion();

            if (packageJsonVersion === newPackageJsonVersion) {
                return;
            }

            console.log("Detected change in package.json. Restarting ng...");

            serverProcess.kill('SIGTERM');

            callee();

        }
    );

})();
            `,
            'utf8'
        )
    );

    // add execute permission
    fs.chmodSync(ngFilePath, '755');
});

export {};
