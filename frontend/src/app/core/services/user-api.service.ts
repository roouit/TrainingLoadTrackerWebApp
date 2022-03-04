import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDTO } from '../interfaces/UserDTO';
import { UserRegisterDTO } from '../interfaces/UserRegisterDTO';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly userApiUrl = 'https://localhost:7286/api/Users';

  constructor(private http: HttpClient) {}

  register(request: UserRegisterDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.userApiUrl}/Register/`, request);
  }
}
