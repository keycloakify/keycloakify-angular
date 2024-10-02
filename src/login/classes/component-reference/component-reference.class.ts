import type { ClassKey } from 'keycloakify/login/lib/kcClsx';
export abstract class ComponentReference {
    doUseDefaultCss: boolean | undefined;
    classes: Partial<Record<ClassKey, string>> | undefined;
}
