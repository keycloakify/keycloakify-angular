import { InjectionToken } from '@angular/core';
import { type KcContext } from '@keycloakify/angular/account/KcContext';

export const KC_ACCOUNT_CONTEXT = new InjectionToken<KcContext>('keycloak account context');
