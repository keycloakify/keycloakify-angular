import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SubmitService {
    #submittableSubj: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isSubmittable: Observable<boolean> = this.#submittableSubj.asObservable();

    setIsSubmittable(submittable: boolean) {
        this.#submittableSubj.next(submittable);
    }
}
