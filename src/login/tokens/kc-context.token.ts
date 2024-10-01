import { InjectionToken } from '@angular/core';
import { type KcContext } from '../KcContext';

export const KC_LOGIN_CONTEXT = new InjectionToken<KcContext>('keycloak login context');
