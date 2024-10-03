import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubmitService {
    #submittableSubj = new BehaviorSubject<boolean>(false);
    isSubmittable: Observable<boolean> = this.#submittableSubj.asObservable();

    setIsSubmittable(submittable: boolean) {
        this.#submittableSubj.next(submittable);
    }
}
