import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingStatusSnapshotDTO } from '../../interfaces/LoadingStatusSnapshotDTO';
import { SessionApiService } from '../../services/session-api.service';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  summary!: LoadingStatusSnapshotDTO;

  constructor(
    private sessionApiService: SessionApiService,
    private userApiService: UserApiService,
  ) {}

  ngOnInit(): void {
    this.getLoadSummary();
    this.getCalculationReliabilityStatus();
  }

  getLoadSummary() {
    this.sessionApiService.getCurrentLoadingStatus().subscribe({
      next: (data) => {
        data.acute = Math.round(data.acute);
        data.chronic = Math.round(data.chronic);
        this.summary = data;
      },
      error: (error) => {},
    });
  }

  getCalculationReliabilityStatus() {
    this.userApiService.getCalculationReliability().subscribe({
      next: (data) => {
        localStorage.setItem('reliableCalculations', String(data.reliable));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
