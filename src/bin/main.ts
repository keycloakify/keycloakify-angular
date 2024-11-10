#!/usr/bin/env node

import { readParams, NOT_IMPLEMENTED_EXIT_CODE } from './core';

const { buildContext, commandName } = readParams({ apiVersion: 'v1' });

(async () => {
    switch (commandName) {
        case 'add-story':
            {
                const { command } = await import('./add-story');
                command({ buildContext });
            }
            return;
        case 'eject-page':
            {
                const { command } = await import('./eject-page');
                command({ buildContext });
            }
            return;
        case 'update-kc-gen':
            {
                const { command } = await import('./update-kc-gen');
                command({ buildContext });
            }
            return;
        case 'initialize-account-theme':
            {
                const { command } = await import('./initialize-account-theme');
                command({ buildContext });
            }
            return;
        default:
            process.exit(NOT_IMPLEMENTED_EXIT_CODE);
    }
})();
