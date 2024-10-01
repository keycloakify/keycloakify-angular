import { InjectionToken } from '@angular/core';
import { type KcContext } from '../KcContext';

export const KC_ACCOUNT_CONTEXT = new InjectionToken<KcContext>('keycloak account context');
