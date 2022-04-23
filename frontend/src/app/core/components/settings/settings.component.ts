import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { UserDTO } from '../../interfaces/UserDTO';
import { UserApiService } from '../../services/user-api.service';
import { ConfirmDeleteAccountDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  userData!: UserDTO;
  genericMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userApiService: UserApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userApiService.getUser().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openConfirmDeleteAccountDialog() {
    const dialogRef = this.dialog.open(ConfirmDeleteAccountDialogComponent, {
      width: '80%',
      maxWidth: '500px',
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val.action === 'delete') {
        this.deleteAccount();
      }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close({ action: 'close' });
    });
  }

  deleteAccount(): void {
    this.userApiService.deleteAccount().subscribe({
      next: (data) => {
        this.userApiService.logout();
        this.router.navigate(['/auth/register']);
      },
      error: (error) => {
        if (error.error === 'Deleting user failed') {
          this.errorMessage = 'Tilin poistaminen epäonnistui'
        } else {
          this.errorMessage = error.error
        }
      },
    });
  }

  logout() {
    this.userApiService.logout();
    this.router.navigate(['/auth/login']);
  }
}
