#!/usr/bin/env node

import {
    readParams,
    NOT_IMPLEMENTED_EXIT_CODE
} from 'keycloakify/bin/shared/customHandler';

const { buildContext, commandName } = readParams({ apiVersion: 'v1' });

console.log(`Running ${commandName} from @keycloakify/angular...`);

console.log(buildContext);

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
            process.exit(NOT_IMPLEMENTED_EXIT_CODE);
        }
        break;
    default:
        process.exit(NOT_IMPLEMENTED_EXIT_CODE);
}
