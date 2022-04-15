import { Component, OnInit } from '@angular/core';
import { LoadingStatusSnapshotDTO } from 'src/app/core/interfaces/LoadingStatusSnapshotDTO';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import Helpers from 'src/app/core/utils/helpers';


@Component({
  selector: 'app-combined-chart',
  templateUrl: './combined-chart.component.html',
  styleUrls: ['./combined-chart.component.css'],
})
export class CombinedChartComponent implements OnInit {
  chartRange: number = 14;
  pointRadius: number = 3;
  chartLastDate: string = format(new Date(), 'd.M');
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

    this.chartLastDate = format(
      Date.parse(
        this.data.date[
          this.rs.value[1]
            ? this.data.date.length + (this.rs.value[1] - 1)
            : this.data.date.length - 1
        ]
      ),
      'd.M'
    );

    this.pointRadius = this.chartRange > 21 ? 1 : 3;
    if (
      typeof this.combinedChart.options.elements?.point?.radius !== 'undefined'
    ) {
      this.combinedChart.options.elements.point.radius = this.pointRadius;
    }

    this.combinedChart.data.labels = this.data.date.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.date.length
    );
    this.combinedChart.data.datasets[0].data = this.data.ratio.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.ratio.length
    );

    this.combinedChart.data.datasets[1].data = this.data.acute.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.acute.length
    );
    this.combinedChart.data.datasets[2].data = this.data.chronic.slice(
      this.rs.value[0],
      this.rs.value[1] || this.data.chronic.length
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
      case 'showRatio':
        return 0;
      case 'showAcute':
        return 1;
      case 'showChronic':
        return 2;
      case 'showExercises':
        return 3;
      default:
        return -1;
    }
  }

  getRoundedRatio(num: number, decimals: number): string {
    const numString = num as unknown as string;
    return +(
      Math.round(parseFloat(numString + `e+${decimals}`)) + `e-${decimals}`
    ) as unknown as string;
  }

  initChart(): void {
    this.combinedChart = new Chart('combined-chart', {
      type: 'line',
      // plugins: [this.plugin],
      data: {
        labels: this.data.date.slice(-this.chartRange),
        datasets: [
          {
            label: 'Suhde',
            data: this.data.ratio.slice(-this.chartRange),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            yAxisID: 'secondary',
            hidden: !this.d.showRatio,
          },
          {
            label: 'Akuutti',
            data: this.data.acute.slice(-this.chartRange),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            hidden: !this.d.showAcute,
          },
          {
            label: 'Krooninen',
            data: this.data.chronic.slice(-this.chartRange),
            backgroundColor: 'rgba(77, 133, 211, 0.2)',
            borderColor: 'rgba(77, 133, 211, 1)',
            hidden: !this.d.showChronic,
          },
          {
            type: 'bar',
            label: 'Harjoitus',
            data: this.data.exercises.slice(-this.chartRange),
            backgroundColor: 'rgba(160, 160, 160, 0.2)',
            borderColor: 'rgba(160, 160, 160, 1)',
            borderWidth: 1,
            borderRadius: 2,
            hidden: !this.d.showExercises,
          },
        ],
      },
      options: {
        elements: {
          point: {
            radius: this.pointRadius,
          },
          line: {
            tension: 0.2,
            borderWidth: 1,
          },
        },
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 10,
              },
              padding: 15,
              boxWidth: 8,
            },
          },
          tooltip: {
            callbacks: {
              // "Mar 31, 2022, 12:00:00 a.m."
              title: (context) => {
                context[0].label.split('');
                return context[0].label;
              },
              label: (context) => {
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }

                if (context.parsed.y !== null) {
                  switch (context.datasetIndex) {
                    case 0:
                      
                      label += Helpers.roundToDecimals(context.parsed.y, 2);
                      break
                    case 1:
                    case 2:
                      label += Helpers.roundToDecimals(context.parsed.y, 1);
                      break
                    default:
                      label += context.parsed.y;
                      break;
                  }
                }
                
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            adapters: {
              date: {
                locale: fi,
              },
            },
            type: 'time',
            ticks: {
              source: 'labels',
              callback: (value, index, ticks) => {
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
              tooltipFormat: 'd.M.Y, cccc',
            },
            grid: {
              offset: false, // grid lines are "at the label"
              color: (context) => {
                // Don't draw grid line on the last label
                if (context.tick.label === this.chartLastDate) {
                  return '';
                }
                return '#E5E5E5';
              },
            },
          },
          y: {
            beginAtZero: true,
            suggestedMax: 600,
            grid: {
              display: false,
            },
          },
          secondary: {
            beginAtZero: true,
            max: 2,
            position: 'right',
            grid: {
              color: ['', '#80b679', '#e5e5e5', '#80b679', ''],
              drawTicks: true,
              borderDash: [8, 4],
              borderWidth: 1,
            },
            ticks: {
              callback: function (value, index, ticks) {
                if ([0, 0.8, 1.0, 1.3, 2].indexOf(value as number) !== -1) {
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
