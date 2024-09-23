/* eslint-disable @angular-eslint/directive-selector */
import { Directive, Input } from '@angular/core';
import { ClassKey } from 'keycloakify/login';

@Directive({ selector: '[doUseDefaultCss]', standalone: true })
export class UseDefaultCssDirective {
  @Input() doUseDefaultCss = true;
  @Input() classes: { [key in ClassKey]?: string } = {};
}