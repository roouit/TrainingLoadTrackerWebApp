import { Component, OnInit } from '@angular/core';
import { LoadSummaryDTO } from '../../interfaces/LoadSummaryDTO';
import { SessionApiService } from '../../services/session-api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  summary!: LoadSummaryDTO;

  constructor(private sessionApiService: SessionApiService) {}

  ngOnInit(): void {
    this.getLoadSummary()
  }

  getLoadSummary() {
    this.sessionApiService.getLoadSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (error) => console.log(error),
    });
  }
}
