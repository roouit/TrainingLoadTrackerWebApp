import { Component, HostListener, Input, OnInit } from '@angular/core';
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
  mobileView!: boolean;
  public innerWidth: any;

  constructor(public userApiService: UserApiService, private router: Router) {}

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.mobileView = this.innerWidth > 800 ? false : true;
  }

  logout() {
    this.userApiService.logout();
    this.sidenav.toggle();
    this.router.navigate(['/auth/login']);
  }

  changePageAction() {
    if (this.mobileView) {
      this.sidenav.toggle()
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.mobileView = this.innerWidth > 800 ? false : true;
  }
}
