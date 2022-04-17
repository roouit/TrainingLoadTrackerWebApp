import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePasswordDTO } from '../interfaces/ChangePasswordDTO';
import { UserDTO } from '../interfaces/UserDTO';
import { UserLoginDTO } from '../interfaces/UserLoginDTO';
import { UserRegisterDTO } from '../interfaces/UserRegisterDTO';
import { UserUpdateDTO } from '../interfaces/UserUpdateDTO';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly baseUrl = `${environment.uri}/Users`;

  constructor(private http: HttpClient) {}

  register(request: UserRegisterDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.baseUrl}/Register/`, request);
  }

  login(request: UserLoginDTO): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/Login/`, request);
  }

  getUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}`);
  }

  update(data: UserUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  loggedIn(): boolean {
    const token: string | null = this.getToken();

    if (token === null) return false;

    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    let eat!: Date;

    if (typeof decoded.exp === 'number') {
      eat = new Date(parseInt(decoded.exp.toString()) * 1000);
    }

    if (eat && eat < new Date()) {
      // Remove token from storage, if expired
      this.logout();
      return false;
    }

    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
