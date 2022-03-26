import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadSummaryDTO } from '../interfaces/LoadSummaryDTO';
import { Session } from '../interfaces/Session';

@Injectable({
  providedIn: 'root',
})
export class SessionApiService {
  private readonly baseUrl = `${environment.uri}/sessions`;

  constructor(private http: HttpClient) {}

  getSessionList(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}`);
  }

  addSession(data: {
    date: Date;
    duration: number;
    rpe: number;
  }): Observable<Session> {
    return this.http.post<Session>(`${this.baseUrl}`, data);
  }

  editSession(data: Session): Observable<Session> {
    return this.http.put<Session>(
      `${this.baseUrl}/${data.sessionId}`,
      data
    );
  }

  deleteSession(sessionId: string) {
    return this.http.delete(`${this.baseUrl}/${sessionId}`);
  }

  getLoadSummary(): Observable<LoadSummaryDTO> {
    return this.http.get<LoadSummaryDTO>(
      `${this.baseUrl}/loadsummary`
    );
  }
}
