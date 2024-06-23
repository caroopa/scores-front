import { Injectable } from '@angular/core';
import { apiURL } from './config'
import { HttpClient } from '@angular/common/http';
import { InstructorScore } from '../domain/domain';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  apiURLInstructor = apiURL + 'instructors/';

  constructor(private http: HttpClient) { }

  getScores() {
    return this.http.get<InstructorScore[]>(this.apiURLInstructor, {});
  }
}
