import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadSummaryDTO } from '../interfaces/LoadSummaryDTO';
import { Session } from '../interfaces/Session';

@Injectable({
  providedIn: 'root',
})
export class SessionApiService {
  private readonly sessionApiUrl = 'https://localhost:7286/api';

  constructor(private http: HttpClient) {}

  getSessionList(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.sessionApiUrl}/sessions/`);
  }

  addSession(data: {
    date: Date;
    duration: number;
    rpe: number;
  }): Observable<Session> {
    return this.http.post<Session>(`${this.sessionApiUrl}/sessions/`, data);
  }

  editSession(data: Session): Observable<Session> {
    return this.http.put<Session>(
      `${this.sessionApiUrl}/sessions/${data.sessionId}`,
      data
    );
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${this.sessionApiUrl}/sessions/${sessionId}`);
  }

  getLoadSummary(): Observable<LoadSummaryDTO> {
    return this.http.get<LoadSummaryDTO>(`${this.sessionApiUrl}/sessions/loadsummary`);
  }
}
