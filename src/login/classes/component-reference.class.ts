import { ClassKey } from "keycloakify/login";
export abstract class ComponentReference {
    doUseDefaultCss: boolean | undefined;
    classes: Partial<Record<ClassKey, string>> | undefined;
}
