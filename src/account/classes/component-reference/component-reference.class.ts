import { ClassKey } from 'keycloakify/account';
export abstract class ComponentReference {
    doUseDefaultCss!: boolean | undefined;
    classes!: Partial<Record<ClassKey, string>> | undefined;
    additionalClasses!: Partial<Record<ClassKey, string>>;
}
