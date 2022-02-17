import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionApiService {
  private readonly sessionApiUrl = 'https://localhost:7286/api';
  constructor(private http: HttpClient) {}

  getSessionList(): Observable<any[]> {
    return this.http.get<any>(this.sessionApiUrl + '/sessions');
  }

  addSession(data: any) {
    return this.http.post(this.sessionApiUrl + '/sessions', data);
  }
}
