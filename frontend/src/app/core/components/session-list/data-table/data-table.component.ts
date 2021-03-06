import { AfterViewInit, ViewChild, Component, OnInit } from '@angular/core';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import { Session } from '../../../interfaces/Session';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditSessionDialogComponent } from '../edit-session-dialog/edit-session-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  genericMessage: string = '';
  errorMessage: string = '';
  dataSource!: MatTableDataSource<Session>;
  columnsToDisplay = ['date', 'duration', 'rpe', 'load', 'buttons'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loaded: boolean = false;

  constructor(
    private sessionApiService: SessionApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionApiService.getSessionList().subscribe({
      next: (data) => {
        this.loaded = true;
        this.dataSource = new MatTableDataSource(this.sortByDate(data));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (session, property) => {
          switch (property) {
            case 'load': {
              return session.duration * session.rpe;
            }
            case 'date': {
              return Date.parse(session.date.toString());
            }
            default: {
              return parseInt(session[property as keyof Session].toString());
            }
          }
        };
      },
      error: (err) => {
        this.loaded = true;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/auth/login']);
          }
        }
      },
    });
  }

  sortByDate(data: Session[]): Session[] {
    return data
      .map((row) => {
        return {
          ...row,
          date: new Date(row.date),
        };
      })
      .sort((a, b) => +b.date - +a.date);
  }

  getFormattedDate(date: string): string {
    return moment(date).format('DD.MM.y');
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.genericMessage = '';
  }

  delete(row: Session): void {
    if (row.sessionId === undefined) return;
    this.sessionApiService.deleteSession(row.sessionId).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(
          (session) => session.sessionId !== row.sessionId
        );
        this.resetMessages();
        this.genericMessage = 'Harjoitus poistettu.';
      },
      error: (err) => {
        this.resetMessages();
        this.errorMessage = 'Virhe harjoitusta poistettaessa.';
      },
    });
  }

  openEditSessionDialog(session: Session) {
    this.resetMessages();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '500px';
    dialogConfig.disableClose = true;
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = 'btn-success';
    dialogConfig.data = session;

    const dialogRef = this.dialog.open(
      EditSessionDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((val) => {
      if (!val.updated) {
        this.resetMessages();
        this.errorMessage = val.message;
        return;
      } 
      this.resetMessages();
      this.genericMessage = 'Harjoitus p??ivitetty.';
    });
  }

  openConfirmDeleteDialog(session: Session) {
    this.resetMessages();
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val.action === 'delete') {
        this.delete(session);
      }
    });

    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close({ action: 'close' });
    });
  }
}
