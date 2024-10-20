import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { Script } from '@keycloakify/angular/lib/models/script';

@Injectable({
    providedIn: 'root'
})
export class ResourceInjectorService {
    private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);

    createLink(url: string): Observable<void> {
        return new Observable<void>(observer => {
            // check if the style is already injected
            if (Array.from(document.styleSheets).some(s => s.href?.includes(url))) {
                observer.next();
                observer.complete();
                console.debug(`stylesheet: ${url} already loaded`);
                return;
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            link.onload = () => {
                observer.next();
                observer.complete();
            };

            link.onerror = () => {
                observer.error(new Error(`Failed to load stylesheet: ${url}`));
            };

            const head = document.head;
            head.insertBefore(link, head.firstChild);
        });
    }
    createScript({ type, id, src, textContent }: Script): void {
        // check if the script is already injected
        if (Array.from(document.scripts).some(s => s.id?.includes(id))) {
            console.debug(`script: ${src} already injected`);
            return;
        }
        const script = document.createElement('script');
        script.type = type;
        if (src) script.src = src;
        if (textContent) script.textContent = textContent;
        script.id = id;

        this.renderer.appendChild(document.head, script);
    }
}
