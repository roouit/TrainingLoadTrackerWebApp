import { Component, OnInit } from '@angular/core';
import { state, style, transition, animate, trigger } from '@angular/animations';

@Component({
  host: {
    '(window:click)': 'onClick($event)',
  },
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('toggleMenu', [
      state(
        'showMenu',
        style({
          width: '120px',
        })
      ),
      state(
        'hideMenu',
        style({
          width: '0',
        })
      ),
      transition('showMenu => hideMenu', [animate('0.2s')]),
      transition('hideMenu => showMenu', [animate('0.2s')]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  isMenuVisible: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleMenu($event: any) {
    $event.stopPropagation();
    this.isMenuVisible = !this.isMenuVisible;
  }

  onClick($event: Event) {
    if (!($event.target as HTMLElement).classList.contains('nav-menu')){
      this.isMenuVisible = false;
    }
  }
}