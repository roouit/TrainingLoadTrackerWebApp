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

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  dataSource!: MatTableDataSource<Session>;
  columnsToDisplay = ['date', 'duration', 'rpe', 'load'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sessionApiService: SessionApiService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionApiService.getSessionList().subscribe({
      next: (data) => {
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
        const indexToDel = this.dataSource.data.findIndex(
          (session) => session.id === val.id
        );
        if (indexToDel !== -1) {
          this.dataSource.data.splice(indexToDel, 1);
        }
      }
    });
  }
}
