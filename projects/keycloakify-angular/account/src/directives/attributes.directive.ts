import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({ selector: '[kcAttributes]', standalone: true })
export class AttributesDirective {
  kcAttributes = input<Record<string, string>>();
  readonly #el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const attributes = this.kcAttributes();
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          this.#renderer.setAttribute(this.#el.nativeElement, `data-${key}`, value);
        });
      }
    });
  }
}
