import { InjectionToken } from '@angular/core';
import type { ClassKey, ExtendKcContext } from 'keycloakify/login';
import type { KcEnvName, ThemeName } from '../../kc.gen';

export type KcContextExtension = {
  themeName: ThemeName;
  properties: Record<KcEnvName, string> & {};
};

export type KcContextExtensionPerPage = Record<string, Record<string, unknown>>;

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;

export const KC_CONTEXT = new InjectionToken<KcContext>('keycloak context');
export const USE_DEFAULT_CSS = new InjectionToken<boolean>('use default css');
export const CLASSES = new InjectionToken<{ [key in ClassKey]?: string }>('classes');