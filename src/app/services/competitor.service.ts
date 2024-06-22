import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableData } from '../domain/table-data';
import { Score } from '../domain/score';
import { apiURL } from './config';

@Injectable({
  providedIn: 'root',
})
export class CompetitorService {
  apiURLCompetitor = apiURL + 'competitors/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<TableData[]>(this.apiURLCompetitor, {});
  }

  calculateTotal(competitor_id: number, score: Score) {
    return this.http.put<void>(
      this.apiURLCompetitor + `calculate_total/${competitor_id}`,
      score,
      {}
    );
  }
}
