import { Component, OnInit } from '@angular/core';
import { LoadingStatusSnapshotDTO } from 'src/app/core/interfaces/LoadingStatusSnapshotDTO';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-combined-chart',
  templateUrl: './combined-chart.component.html',
  styleUrls: ['./combined-chart.component.css'],
})
export class CombinedChartComponent implements OnInit {
  combinedChart!: Chart;

  constructor(private sessionApiService: SessionApiService) {}

  ngOnInit(): void {
    this.combinedChart = new Chart('combined-chart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Akuutti',
            data: [],
            backgroundColor: 'rgba(255, 99, 232, 0.2)',
            borderColor: 'rgba(155, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Krooninen',
            data: [],
            backgroundColor: 'rgba(155, 199, 232, 0.2)',
            borderColor: 'rgba(155, 199, 232, 1)',
            borderWidth: 1,
          },
          {
            label: 'Suhde',
            data: [],
            backgroundColor: 'rgba(20, 99, 232, 0.2)',
            borderColor: 'rgba(20, 99, 232, 1)',
            borderWidth: 1,
            yAxisID: 'secondary'
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          secondary: {
            beginAtZero: true,
            max: 2,
            position: 'right',
            grid: {
              drawOnChartArea: false
            }
          },
        },
      },
    });
    this.sessionApiService.getLoadingStatusHistory().subscribe({
      next: (data) => {
        this.setDataForChart(data);
      },
      error: (error) => console.log(error),
    });
  }

  setDataForChart(data: LoadingStatusSnapshotDTO[]): void {
    const chartData: any = {
      date: [],
      acute: [],
      chronic: [],
      ratio: [],
    };

    for (const snapshot of data) {
      chartData.date.push(snapshot.snapshotDate.toString().split('T')[0]);
      chartData.acute.push(snapshot.acute);
      chartData.chronic.push(snapshot.chronic);
      chartData.ratio.push(snapshot.ratio);
    }
    console.log(chartData);
    this.combinedChart.data.labels = chartData.date;
    this.combinedChart.data.datasets.forEach((dataset) => {
      switch (dataset.label) {
        case 'Akuutti':
          dataset.data = chartData.acute;
          break;
        case 'Krooninen':
          dataset.data = chartData.chronic;
          break;
        case 'Suhde':
          dataset.data = chartData.ratio;
          break;
        default:
          break;
      }
    })
    this.combinedChart.update();
  }

  formatXTicks(): string {
    return '';
  }
}
