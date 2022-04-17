import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { UserDTO } from '../../interfaces/UserDTO';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  userData!: UserDTO;

  constructor(private userApiService: UserApiService) {
  }

  ngOnInit(): void {
    this.userApiService.getUser().subscribe({
      next: (data) => {
        this.userData = data
      },
      error: (error => {
        console.log(error)
      })
    })
  }

  deleteAccount(): void {
    console.log('poista tili');
  }
}
