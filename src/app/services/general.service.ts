import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { General, Score, TrophyCount } from '../schemas/domain';
import { apiURL, apiURLws } from './config';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private apiURLGeneral = apiURL + 'general/';
  private webSocket!: WebSocket;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    // this.webSocket = new WebSocket('wss://' + apiURLws + '/ws');
    this.webSocket = new WebSocket('ws://' + apiURLws + '/ws');

    this.webSocket.onopen = () => {
      // console.log('Conectado al servidor WebSocket');
    };

    this.webSocket.onmessage = (event) => {
      const message = event.data;
      // console.log('Mensaje del servidor:', message);
      this.sharedService.reload();
    };

    this.webSocket.onclose = () => {
      // console.log('Desconectado del servidor WebSocket');
    };
  }

  getAll() {
    return this.http.get<General[]>(this.apiURLGeneral, {});
  }

  uploadData(fileData: File) {
    const formData = new FormData();
    formData.append('file', fileData);
    return this.http.post<void>(this.apiURLGeneral + 'upload', formData, {});
  }

  calculateTotal(competitor_id: number, score: Score) {
    const message = JSON.stringify({
      action: 'calculate_total',
      competitor_id: competitor_id,
      score: score,
    });
    this.webSocket.send(message);

    return this.http.put<void>(
      this.apiURLGeneral + `calculate_total/${competitor_id}`,
      score,
      {}
    );
  }

  trophiesCounts() {
    return this.http.get<TrophyCount[]>(
      this.apiURLGeneral + `trophies_counts`,
      {}
    );
  }
}
