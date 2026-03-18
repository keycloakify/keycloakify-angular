import { type ClassKey } from 'keycloakify/account/lib/kcClsx';
export abstract class ComponentReference {
    doUseDefaultCss!: boolean | undefined;
    classes!: Partial<Record<ClassKey, string>> | undefined;
    additionalClasses!: Partial<Record<ClassKey, string>>;
}
