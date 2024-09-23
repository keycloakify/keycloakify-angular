
import { ClassKey } from 'keycloakify/login';
import { InputSignal } from '@angular/core';
export abstract class ComponentReference {
  doUseDefaultCss!: InputSignal<boolean | undefined>;
  classes!: InputSignal<Partial<Record<ClassKey, string>> | undefined>;
}