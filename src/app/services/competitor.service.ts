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
    return this.http.get<Competitor[]>(apiURL + "competitors", {});
  }
}
