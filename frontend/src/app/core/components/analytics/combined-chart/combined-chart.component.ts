import { Component, OnInit } from '@angular/core';
import { LoadingStatusSnapshotDTO } from 'src/app/core/interfaces/LoadingStatusSnapshotDTO';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
// import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-combined-chart',
  templateUrl: './combined-chart.component.html',
  styleUrls: ['./combined-chart.component.css'],
})
export class CombinedChartComponent implements OnInit {
  combinedChart!: Chart;
  data: any = {
    date: [],
    acute: [],
    chronic: [],
    ratio: [],
    exercises: [],
  };

  d: any = {
    loaded: false,
    showRatio: true,
    showAcute: true,
    showChronic: true,
    showExercises: true
  }
  

  constructor(private sessionApiService: SessionApiService) {}

  ngOnInit(): void {
    this.sessionApiService.getLoadingStatusHistory().subscribe({
      next: (data) => {
        this.setData(data);
        this.initChart();
        this.d.loaded = true;
      },
      error: (error) => console.log(error),
    });
  }

  setData(data: LoadingStatusSnapshotDTO[]): void {
    for (const snapshot of data) {
      this.data.date.push(snapshot.snapshotDate.toString().split('T')[0]);
      this.data.acute.push(snapshot.acute);
      this.data.chronic.push(snapshot.chronic);
      this.data.ratio.push(snapshot.ratio);
      this.data.exercises.push(snapshot.dailyLoad);
    }
  }

  onSlideToggleChange($event: MatSlideToggleChange): void {
    this.d[$event.source.id] = $event.checked;
    console.log(this.d)
  }

  initChart(): void {
    this.combinedChart = new Chart('combined-chart', {
      type: 'line',
      data: {
        labels: this.data.date.slice(-28),
        datasets: [
          {
            label: 'Akuutti',
            data: this.data.acute.slice(-28),
            backgroundColor: 'rgba(255, 99, 232, 0.2)',
            borderColor: 'rgba(155, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Krooninen',
            data: this.data.chronic.slice(-28),
            backgroundColor: 'rgba(155, 199, 232, 0.2)',
            borderColor: 'rgba(155, 199, 232, 1)',
            borderWidth: 1,
          },
          {
            label: 'Suhde',
            data: this.data.ratio.slice(-28),
            backgroundColor: 'rgba(20, 99, 232, 0.2)',
            borderColor: 'rgba(20, 99, 232, 1)',
            borderWidth: 1,
            yAxisID: 'secondary',
          },
          {
            label: 'Harjoitus',
            data: this.data.exercises.slice(-28),
            backgroundColor: 'rgba(120, 99, 132, 0.2)',
            borderColor: 'rgba(120, 199, 132, 1)',
            type: 'bar',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            ticks: {
              callback: function (value, index, ticks) {
                return format(ticks[index].value, 'd.M');
              },
            },
            time: {
              displayFormats: {
                month: 'M',
                day: 'dd',
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
            },
          },
          secondary: {
            beginAtZero: true,
            max: 2,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              callback: function (value, index, ticks) {
                return value;
              },
              stepSize: 0.2,
            },
          },
        },
      },
    });
  }
}
