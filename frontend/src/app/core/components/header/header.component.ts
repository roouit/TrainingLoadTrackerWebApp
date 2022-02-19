import { Component, OnInit } from '@angular/core';
import { state, style, transition, animate, trigger } from '@angular/animations';

@Component({
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

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
