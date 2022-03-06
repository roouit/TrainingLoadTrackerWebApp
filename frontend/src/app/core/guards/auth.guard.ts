import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserApiService } from '../services/user-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userApiService: UserApiService, private router: Router) {}

  canActivate(): boolean {
    if (this.userApiService.loggedIn()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}
