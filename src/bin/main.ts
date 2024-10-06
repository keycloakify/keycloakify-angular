#!/usr/bin/env node

import { readParams, NOT_IMPLEMENTED_EXIT_CODE } from './core';

const { buildContext, commandName } = readParams({ apiVersion: 'v1' });

(async () => {
    switch (commandName) {
        case 'add-story':
            {
                console.log('Not yet supported by @keycloakify/angular');
                process.exit(-1);
            }
            break;
        case 'eject-page':
            {
                console.log('Not yet supported by @keycloakify/angular');
                process.exit(-1);
            }
            break;
        case 'update-kc-gen':
            {
                const { command } = await import('./update-kc-gen');
                command({ buildContext });
            }
            break;
        default:
            process.exit(NOT_IMPLEMENTED_EXIT_CODE);
    }
})();
