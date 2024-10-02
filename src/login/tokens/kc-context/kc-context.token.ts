import { InjectionToken } from '@angular/core';
import { type KcContext } from '@keycloakify/angular/login/KcContext';

export const KC_LOGIN_CONTEXT = new InjectionToken<KcContext>('keycloak login context');
