/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import {
  Directive,
  DoCheck,
  ElementRef,
  inject,
  Input,
  isDevMode,
  Renderer2,
  ɵstringify as stringify,
} from '@angular/core';
import { ClassKey } from 'keycloakify/account';
import { getKcClsx } from 'keycloakify/account/lib/kcClsx';
import { ComponentReference } from '@keycloakify/angular/account/classes/component-reference';

interface CssClassState {
  // PERF: could use a bit mask to represent state as all fields are boolean flags
  enabled: boolean;
  changed: boolean;
  touched: boolean;
}

type KcClassSupportedTypes = ClassKey[] | Set<ClassKey> | Partial<{ [key in ClassKey]: any }> | null | undefined;

type NgClassSupportedTypes = string[] | Set<string> | { [key: string]: any } | null | undefined;

@Directive({ selector: '[kcClass]', standalone: true })
export class KcClassDirective implements DoCheck {
  private initialClasses: string[] = [];
  private rawClass: NgClassSupportedTypes;
  private rawKcClass: KcClassSupportedTypes;

  private stateMap = new Map<string | ClassKey, CssClassState>();
  readonly #renderer = inject(Renderer2);
  readonly #el = inject(ElementRef);
  readonly #host = inject(ComponentReference);
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('class')
  set klass(value: string) {
    this.initialClasses = value != null ? value.trim().split(/\s+/) : [];
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngClass')
  set ngClass(value: string | NgClassSupportedTypes) {
    this.rawClass = typeof value === 'string' ? value.trim().split(/\s+/) : value;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('kcClass')
  set kcClass(value: ClassKey | KcClassSupportedTypes) {
    this.rawKcClass = typeof value === 'string' ? (value.trim().split(/\s+/) as ClassKey[]) : value;
  }

  ngDoCheck(): void {
    for (const klass of this.initialClasses) {
      this._updateState(klass, true);
    }
    // classes from the [ngClass] binding
    const rawClass = this.rawClass;
    if (Array.isArray(rawClass) || rawClass instanceof Set) {
      for (const klass of rawClass) {
        this._updateState(klass, true);
      }
    } else if (rawClass != null) {
      for (const klass of Object.keys(rawClass)) {
        this._updateState(klass, Boolean(rawClass[klass]));
      }
    }

    // classes from the [kcClass] binding
    const rawKcClass = this.rawKcClass;
    if (Array.isArray(rawKcClass) || rawKcClass instanceof Set) {
      for (const klass of rawKcClass) {
        this._updateState(klass, true, true);
      }
    } else if (rawKcClass != null) {
      for (const klass of Object.keys(rawKcClass)) {
        this._updateState(klass, Boolean(rawKcClass[klass as ClassKey]), true);
      }
    }

    this._applyStateDiff();
  }

  private _updateState(klass: string | ClassKey, nextEnabled: boolean, kcClsxCheck = false) {
    const state = this.stateMap.get(klass);
    if (state !== undefined) {
      if (state.enabled !== nextEnabled) {
        state.changed = true;
        state.enabled = nextEnabled;
      }
      state.touched = true;
    } else {
      let klassChecked = klass;
      if (kcClsxCheck) {
        const doUseDefaultCss = this.#host.doUseDefaultCss ?? true;
        const classes = { ...(this.#host.classes ?? {}), ...(this.#host.additionalClasses ?? {}) };
        const kcClsx = getKcClsx({ doUseDefaultCss, classes }).kcClsx;
        klassChecked = kcClsx(klass as ClassKey);
      }
      this.stateMap.set(klassChecked, {
        enabled: nextEnabled,
        changed: true,
        touched: true,
      });
    }
  }

  private _applyStateDiff() {
    for (const stateEntry of this.stateMap) {
      const klass = stateEntry[0];
      const state = stateEntry[1];

      if (state.changed) {
        this._toggleClass(klass, state.enabled);
        state.changed = false;
      } else if (!state.touched) {
        // A class that was previously active got removed from the new collection of classes -
        // remove from the DOM as well.
        if (state.enabled) {
          this._toggleClass(klass, false);
        }
        this.stateMap.delete(klass);
      }

      state.touched = false;
    }
  }

  private _toggleClass(klass: string, enabled: boolean): void {
    if (isDevMode()) {
      if (typeof klass !== 'string') {
        throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${stringify(klass)}`);
      }
    }

    klass = klass.trim();
    if (klass.length > 0) {
      klass.split(/\s+/).forEach((klass) => {
        if (enabled) {
          this.#renderer.addClass(this.#el.nativeElement, klass);
        } else {
          this.#renderer.removeClass(this.#el.nativeElement, klass);
        }
      });
    }
  }
}
