import { InjectionToken } from '@angular/core';
import type { ClassKey } from 'keycloakify/login/lib/kcClsx';

export const LOGIN_CLASSES = new InjectionToken<{ [key in ClassKey]?: string }>(
    'login classes'
);
