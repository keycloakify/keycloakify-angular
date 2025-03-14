import { inject, Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { I18n } from '@keycloakify/angular/login/i18n';
import { LOGIN_I18N } from '@keycloakify/angular/login/tokens/i18n';
import { KC_LOGIN_CONTEXT } from '@keycloakify/angular/login/tokens/kc-context';
import { DO_MAKE_USER_CONFIRM_PASSWORD } from '@keycloakify/angular/login/tokens/make-user-confirm-password';
import type {
    Attribute,
    PasswordPolicies,
    Validators
} from 'keycloakify/login/KcContext';
import * as reactlessApi from 'keycloakify/login/lib/getUserProfileApi';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { assert, type Equals } from 'tsafe/assert';

export { getButtonToDisplayForMultivaluedAttributeField } from 'keycloakify/login/lib/getUserProfileApi';

export type FormFieldError = {
    errorMessage: SafeHtml;
    errorMessageStr: string;
    source: FormFieldError.Source;
    fieldIndex: number | undefined;
};

{
    type A = Omit<FormFieldError, 'errorMessage' | 'errorMessageStr'>;
    type B = Omit<reactlessApi.FormFieldError, 'advancedMsgArgs'>;

    assert<Equals<A, B>>();
}

export namespace FormFieldError {
    export type Source =
        | Source.Validator
        | Source.PasswordPolicy
        | Source.Server
        | Source.Other;

    export namespace Source {
        export type Validator = {
            type: 'validator';
            name: keyof Validators;
        };
        export type PasswordPolicy = {
            type: 'passwordPolicy';
            name: keyof PasswordPolicies;
        };
        export type Server = {
            type: 'server';
        };

        export type Other = {
            type: 'other';
            rule: 'passwordConfirmMatchesPassword' | 'requiredField';
        };
    }
}

{
    type A = FormFieldError.Source;
    type B = reactlessApi.FormFieldError.Source;

    assert<Equals<A, B>>();
}

export type FormFieldState = {
    attribute: Attribute;
    displayableErrors: FormFieldError[];
    valueOrValues: string | string[];
};

{
    type A = Omit<FormFieldState, 'displayableErrors'>;
    type B = Omit<reactlessApi.FormFieldState, 'displayableErrors'>;

    assert<Equals<A, B>>();
}

export type FormState = {
    isFormSubmittable: boolean;
    formFieldStates: FormFieldState[];
};

{
    type A = Omit<FormState, 'formFieldStates'>;
    type B = Omit<FormState, 'formFieldStates'>;

    assert<Equals<A, B>>();
}

export type FormAction =
    | {
          action: 'update';
          name: string;
          valueOrValues: string | string[];
          /** Default false */
          displayErrorsImmediately?: boolean;
      }
    | {
          action: 'focus lost';
          name: string;
          fieldIndex: number | undefined;
      };

{
    type A = FormAction;
    type B = reactlessApi.FormAction;

    assert<Equals<A, B>>();
}

export type KcContextLike = reactlessApi.KcContextLike;

export type I18nLike = Pick<I18n, 'advancedMsgStr'>;

@Injectable({ providedIn: 'root' })
export class UserProfileFormService implements OnDestroy {
    #kcContext = inject<KcContextLike>(KC_LOGIN_CONTEXT);
    #i18n = inject<I18nLike>(LOGIN_I18N);
    #doMakeUserConfirmPassword = inject(DO_MAKE_USER_CONFIRM_PASSWORD);
    #domSanitizer = inject(DomSanitizer);
    #internal_formState$: BehaviorSubject<reactlessApi.FormState>;
    #unsubscribe: (() => void) | undefined;
    public formState$: Observable<FormState>;
    public dispatchFormAction: (action: FormAction) => void;
    constructor() {
        const api = reactlessApi.getUserProfileApi({
            kcContext: this.#kcContext,
            doMakeUserConfirmPassword: this.#doMakeUserConfirmPassword
        });
        this.#internal_formState$ = new BehaviorSubject<reactlessApi.FormState>(
            api.getFormState()
        );
        this.#unsubscribe = api.subscribeToFormState(() => {
            this.#internal_formState$.next(api.getFormState());
        }).unsubscribe;
        this.formState$ = this.#internal_formState$.asObservable().pipe(
            takeUntilDestroyed(),
            map(formState_reactless => ({
                isFormSubmittable: formState_reactless.isFormSubmittable,
                formFieldStates: formState_reactless.formFieldStates.map(
                    formFieldState_reactless => ({
                        attribute: formFieldState_reactless.attribute,
                        valueOrValues: formFieldState_reactless.valueOrValues,
                        displayableErrors: formFieldState_reactless.displayableErrors.map(
                            formFieldError_reactless => ({
                                errorMessage: this.#domSanitizer.bypassSecurityTrustHtml(
                                    this.#i18n.advancedMsgStr(
                                        ...formFieldError_reactless.advancedMsgArgs
                                    )
                                ),
                                errorMessageStr: this.#i18n.advancedMsgStr(
                                    ...formFieldError_reactless.advancedMsgArgs
                                ),
                                source: formFieldError_reactless.source,
                                fieldIndex: formFieldError_reactless.fieldIndex
                            })
                        )
                    })
                )
            }))
        );
        this.dispatchFormAction = api.dispatchFormAction;
    }

    ngOnDestroy(): void {
        this.#internal_formState$.complete();
        this.#internal_formState$.unsubscribe();
        if (this.#unsubscribe) this.#unsubscribe();
    }
}
