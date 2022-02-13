import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionApiService } from 'src/app/services/session-api.service';

@Component({
  selector: 'app-show-session',
  templateUrl: './show-session.component.html',
  styleUrls: ['./show-session.component.css']
})
export class ShowSessionComponent implements OnInit {

  sessionList$: Observable<any[]>;

  constructor(private sessionApiService: SessionApiService) {
    this.sessionList$ = new Observable<any[]>();
   }

  ngOnInit(): void {
    this.sessionList$ = this.sessionApiService.getSessionList();
  }

}
