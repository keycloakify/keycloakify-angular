import type { Signal, TemplateRef } from '@angular/core';

export interface TemplateSlots {
    displayInfo?: boolean;
    displayMessage?: boolean;
    displayRequiredFields?: boolean;
    documentTitle?: string;
    bodyClassName?: string;
    headerNode?: Signal<TemplateRef<HTMLElement> | undefined>;
    infoNode?: Signal<TemplateRef<HTMLElement> | undefined>;
    socialProvidersNode?: Signal<TemplateRef<HTMLElement> | undefined>;
}
