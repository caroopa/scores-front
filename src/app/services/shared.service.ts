import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private reloadSubject = new Subject<void>();

  get reload$() {
    return this.reloadSubject.asObservable();
  }

  reload() {
    this.reloadSubject.next();
  }
}
