import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private reloadSubject = new Subject<void>();
  private uploadSubject = new Subject<void>();

  constructor(private socket: Socket) {
    this.socket.on('reload', () => {
      this.reload();
    });
  }

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
