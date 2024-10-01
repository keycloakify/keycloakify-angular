import { InjectionToken } from '@angular/core';
import { type ClassKey } from 'keycloakify/account/lib/kcClsx';

export const ACCOUNT_CLASSES = new InjectionToken<{ [key in ClassKey]?: string }>(
    'account classes'
);
