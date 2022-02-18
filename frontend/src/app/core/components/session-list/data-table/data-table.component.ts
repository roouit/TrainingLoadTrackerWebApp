import { Component, OnInit } from '@angular/core';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import { Session } from '../../../interfaces/Session';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditSessionDialogComponent } from '../edit-session-dialog/edit-session-dialog.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  sessionsData!: Session[];

  constructor(
    private sessionApiService: SessionApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sessionApiService.getSessionList().subscribe((data) => {
      this.sessionsData = data;
    });
  }

  getLoad(id: number | undefined): number {
    if (id == undefined) return 0;
    const session = this.sessionsData.find((session) => session.id == id);
    return session ? session.duration * session.rpe : 0;
  }

  openDialog(session: Session) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = session;

    const dialogRef = this.dialog.open(
      EditSessionDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((val) => {
      if (val.action === 'delete') {
        const indexToDel = this.sessionsData.findIndex(session => session.id === val.id);
        if (indexToDel !== -1) {
          this.sessionsData.splice(indexToDel, 1);
        }
        
      }
    });
  }
}
