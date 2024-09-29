import { NgComponentOutlet } from '@angular/common';
import { Component, input, Type } from '@angular/core';

@Component({
  selector: 'kc-wrapper',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    @let component = Component();
    @if (component) {
      <ng-container *ngComponentOutlet="component" />
    } @else {
      <p>No component</p>
    }
  `,
})
export class WrapperComponent {
  Component = input<Type<unknown> | null>(null);
}
