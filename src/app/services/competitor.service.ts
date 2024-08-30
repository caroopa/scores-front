import { Injectable } from '@angular/core';
import { apiURL } from './config';
import { HttpClient } from '@angular/common/http';
import { CompetitorScore } from '../schemas/domain';

@Injectable({
  providedIn: 'root',
})
export class CompetitorService {
  apiURLCompetitor = apiURL + 'competitors/';

  constructor(private http: HttpClient) {}

  getScores(category: string) {
    return this.http.get<CompetitorScore[]>(this.apiURLCompetitor + category, {});
  }
}
