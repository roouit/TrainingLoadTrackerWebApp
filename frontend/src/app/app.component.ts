import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: string = 'TLOAD Tracker';
  mobileView!: boolean;
  public innerWidth: any;

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.mobileView = this.innerWidth > 800 ? false : true
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    this.mobileView = this.innerWidth > 800 ? false : true;
  }
}
