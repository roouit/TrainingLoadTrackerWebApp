import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../interfaces/Session';

@Injectable({
  providedIn: 'root',
})
export class SessionApiService {
  private readonly sessionApiUrl = 'https://localhost:7286/api';

  constructor(private http: HttpClient) {}

  getSessionList(): Observable<Session[]> {
    return this.http.get<any>(`${this.sessionApiUrl}/sessions/`);
  }

  addSession(data: Session) {
    return this.http.post(`${this.sessionApiUrl}/sessions/`, data);
  }

  editSession(data: Session) {
    return this.http.put(`${this.sessionApiUrl}/sessions/${data.id}`, data);
  }
}
