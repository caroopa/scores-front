import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private reloadSubject = new Subject<void>();
  private uploadSubject = new Subject<void>();

  constructor() {}

  get reload$() {
    return this.reloadSubject.asObservable();
  }

  reload() {
    this.reloadSubject.next();
  }

  get upload$() {
    return this.uploadSubject.asObservable();
  }

  upload() {
    this.uploadSubject.next();
  }
}
