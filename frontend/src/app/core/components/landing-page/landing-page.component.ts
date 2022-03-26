import { Component, OnInit } from '@angular/core';
import { LoadingStatusSnapshotDTO } from '../../interfaces/LoadingStatusSnapshotDTO';
import { SessionApiService } from '../../services/session-api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  summary!: LoadingStatusSnapshotDTO;

  constructor(private sessionApiService: SessionApiService) {}

  ngOnInit(): void {
    this.getLoadSummary();
  }

  getLoadSummary() {
    this.sessionApiService.getCurrentLoadingStatus().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => console.log(error),
    });
  }
}
