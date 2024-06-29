import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { General, Score } from '../domain/domain';
import { apiURL } from './config';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  apiURLGeneral = apiURL + 'general/';

  constructor(private http: HttpClient, private sharedService: SharedService) {}

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

  uploadData(fileData: File) {
    const formData = new FormData();
    formData.append('file', fileData);
    return this.http.post<void>(this.apiURLGeneral + 'upload', formData, {});
  }
}
