import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competitor } from '../domain/competitor';
import { apiURL } from './config';

@Injectable({
  providedIn: 'root',
})
export class CompetitorService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Competitor[]>(apiURL + 'competitors', {});
  }

  calculateTotal(competitor: Competitor) {
    const id = competitor.id_competitor;
    const forms = competitor.forms;
    const combat = competitor.combat;
    const jump = competitor.jump;
    return this.http.put<void>(
      apiURL +
        `calculate_total/${id}?forms=${forms}&jump=${jump}&combat=${combat}`,
      {}
    );
  }
}
