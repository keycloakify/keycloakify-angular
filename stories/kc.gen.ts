export const themeNames = ['keycloakify-angular'] as const;

export type ThemeName = (typeof themeNames)[number];

export type KcEnvName = never;

export const kcEnvDefaults: Record<KcEnvName, string> = {};
