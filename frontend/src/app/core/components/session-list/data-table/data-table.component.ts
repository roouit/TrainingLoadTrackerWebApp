import { Component, OnInit } from '@angular/core';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import { Session } from '../../../interfaces/Session';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  sessionsData!: Session[];

  constructor(private sessionApiService: SessionApiService) { }

  ngOnInit(): void {
    this.sessionApiService.getSessionList().subscribe(data => {
      this.sessionsData = data;
    })
  }

  getLoad(id: number | undefined): number {
    if (id == undefined) return 0;
    const session = this.sessionsData.find(session => session.id == id);
    return session ? session.duration * session.rpe : 0;
  }

}
