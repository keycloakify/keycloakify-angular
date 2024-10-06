#!/usr/bin/env node

import { readParams, NOT_IMPLEMENTED_EXIT_CODE } from './core';

const { buildContext, commandName } = readParams({ apiVersion: 'v1' });

(async () => {
    switch (commandName) {
        case 'add-story':
            {
                process.exit(NOT_IMPLEMENTED_EXIT_CODE);
            }
            break;
        case 'eject-page':
            {
                process.exit(NOT_IMPLEMENTED_EXIT_CODE);
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
