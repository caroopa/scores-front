import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { General, Score } from '../domain/domain';
import { apiURL } from './config';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  apiURLGeneral = apiURL + 'general/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<General[]>(this.apiURLGeneral, {});
  }

  calculateTotal(competitor_id: number, score: Score) {
    return this.http.put<void>(
      this.apiURLGeneral + `calculate_total/${competitor_id}`,
      score,
      {}
    );
  }
}
