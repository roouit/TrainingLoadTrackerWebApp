import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.css'],
})
export class SideNavigationComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  constructor(public userApiService: UserApiService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.userApiService.logout();
    this.sidenav.toggle();
    this.router.navigate(['/auth/login']);
  }
}
