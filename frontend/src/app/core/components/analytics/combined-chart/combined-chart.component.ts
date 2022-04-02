import { Component, OnInit } from '@angular/core';
import { LoadingStatusSnapshotDTO } from 'src/app/core/interfaces/LoadingStatusSnapshotDTO';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
  selector: 'app-combined-chart',
  templateUrl: './combined-chart.component.html',
  styleUrls: ['./combined-chart.component.css'],
})
export class CombinedChartComponent implements OnInit {
  chartRange: number = 14;
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
    showExercises: true,
  };

  rs: any = {
    step: 1,
    min: -60,
    max: 0,
    value: [-this.chartRange, 0],
  };

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

    const datasetIndex = this.getDatasetIndex($event.source.id);

    if (datasetIndex === -1) return;

    this.d[$event.source.id]
      ? this.combinedChart.show(datasetIndex)
      : this.combinedChart.hide(datasetIndex);
  }

  onSliderChange(event: any) {
    this.rs.value = event.value;
  }

  onSliderRelease(event: any) {
    this.chartRange = event.value[1] - event.value[0];

    this.combinedChart.data.labels = this.data.date.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.date.length
    );
    this.combinedChart.data.datasets[0].data = this.data.acute.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.acute.length
    );
    this.combinedChart.data.datasets[1].data = this.data.chronic.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.chronic.length
    );
    this.combinedChart.data.datasets[2].data = this.data.ratio.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.ratio.length
    );
    this.combinedChart.data.datasets[3].data = this.data.exercises.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.exercises.length
    );

    this.combinedChart.update();
  }

  /**
   * Gets the index of a dataset that the toggle name belongs to
   * @param toggleChangeName The name (id) of the toggle that was changed
   * @returns The index of the dataset in the chart datasets
   */
  getDatasetIndex(toggleChangeName: string): number {
    switch (toggleChangeName) {
      case 'showAcute':
        return 0;
      case 'showChronic':
        return 1;
      case 'showRatio':
        return 2;
      case 'showExercises':
        return 3;
      default:
        return -1;
    }
  }

  // plugin = {
  //   id: 'custom_canvas_background_color',
  //   beforeDraw: (chart: any) => {
  //     const ctx = chart.canvas.getContext('2d');
  //     ctx.save();
  //     ctx.globalCompositeOperation = 'destination-over';
  //     ctx.fillStyle = 'lightGreen';
  //     ctx.fillRect(44, 100, 308, chart.height);
  //     ctx.restore();
  //   },
  // };

  initChart(): void {
    this.combinedChart = new Chart('combined-chart', {
      type: 'line',
      // plugins: [this.plugin],

      data: {
        labels: this.data.date.slice(-this.chartRange),
        datasets: [
          {
            label: 'Akuutti',
            data: this.data.acute.slice(-this.chartRange),
            backgroundColor: 'rgba(255, 99, 232, 0.2)',
            borderColor: 'rgba(155, 99, 132, 1)',
            borderWidth: 1,
            hidden: !this.d.showAcute,
          },
          {
            label: 'Krooninen',
            data: this.data.chronic.slice(-this.chartRange),
            backgroundColor: 'rgba(155, 199, 232, 0.2)',
            borderColor: 'rgba(155, 199, 232, 1)',
            borderWidth: 1,
            hidden: !this.d.showChronic,
          },
          {
            label: 'Suhde',
            data: this.data.ratio.slice(-this.chartRange),
            backgroundColor: 'lightGreen',
            borderColor: 'green',
            borderWidth: 1,
            yAxisID: 'secondary',
            hidden: !this.d.showRatio,
            tension: 0.4,
            pointRadius: 2,
          },
          {
            label: 'Harjoitus',
            data: this.data.exercises.slice(-this.chartRange),
            backgroundColor: 'rgba(120, 99, 132, 0.2)',
            borderColor: 'rgba(20, 20, 20, 1)',
            borderWidth: 1,
            type: 'bar',
            hidden: !this.d.showExercises,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              pointStyle: 'line',
            },
          },
        },
        scales: {
          x: {
            type: 'time',
            ticks: {
              callback: function (value, index, ticks) {
                const last = parseInt(
                  format(ticks[ticks.length - 1].value, 'D', {
                    useAdditionalDayOfYearTokens: true,
                  })
                );
                const current = parseInt(
                  format(ticks[index].value, 'D', {
                    useAdditionalDayOfYearTokens: true,
                  })
                );

                if ((last - current) % 7 === 0) {
                  return format(ticks[index].value, 'd.M');
                }
                return null;
              },
              maxRotation: 0,
            },
            time: {
              displayFormats: {
                month: 'M',
                day: 'dd',
              },
              stepSize: 1,
            },
            grid: {
              offset: false,
              color: function (context) {
                if (context.tick.label === format(new Date(), 'd.M')) {
                  return '';
                }
                return '#E5E5E5';
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
            suggestedMax: 2,
            position: 'right',
            grid: {
              color: '#80b679',
              drawTicks: false,
              borderDash: [8, 4],
              borderWidth: 1,
            },
            ticks: {
              callback: function (value, index, ticks) {
                console.log(ticks);
                console.log(typeof value);
                if ([0.8, 1.3].indexOf(value as number) !== -1) {
                  return value;
                }
                return null;
              },
              stepSize: 0.1,
            },
          },
        },
      },
    });
  }
}
