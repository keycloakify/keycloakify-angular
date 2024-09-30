import { InjectionToken } from '@angular/core';
import { ClassKey } from 'keycloakify/login/lib/kcClsx';

export const LOGIN_CLASSES = new InjectionToken<{ [key in ClassKey]?: string }>(
    'login classes'
);