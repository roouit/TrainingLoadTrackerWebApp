import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadingStatusSnapshotDTO } from 'src/app/core/interfaces/LoadingStatusSnapshotDTO';
import { ReliabilityWarningDialogComponent } from 'src/app/core/utils/help-dialogs/reliability-warning-dialog/reliability-warning-dialog.component';
import Helpers from 'src/app/core/utils/helpers';

@Component({
  selector: 'app-load-summary',
  templateUrl: './load-summary.component.html',
  styleUrls: ['./load-summary.component.css'],
})
export class LoadSummaryComponent {
  @Input() summary!: LoadingStatusSnapshotDTO;
  loaded: boolean = false;
  description: string = '';
  descriptionBgColor: string = 'white';
  showWarning: boolean = false;

  constructor(private dialog: MatDialog) {}

  ngDoCheck() {
    if (!(localStorage.getItem('reliableCalculations') === 'true') && !this.showWarning) {
      this.showWarning = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['summary'].currentValue) {
      this.loaded = true;
      this.setDescription();
    }
  }

  getRoundedRatio(): string {
    if (!this.loaded) return '0';
    return Helpers.roundToDecimals(this.summary.ratio, 2);
  }

  getRatioColor(): string {
    if (!this.loaded) return 'black';

    if (this.summary.ratio >= 0.8 && this.summary.ratio <= 1.3) {
      return 'green';
    } else if (this.summary.ratio < 0.7 || this.summary.ratio > 1.5) {
      return 'red';
    }
    return '#ffd000'; // Orange-ish
  }

  showCalculationWarning() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '90%';
    dialogConfig.maxWidth = '500px';
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = undefined;

    this.dialog.open(ReliabilityWarningDialogComponent, dialogConfig);
  }

  setDescription(): void {
    if (!this.loaded) return;

    if (this.summary.ratio < 0.7) {
      this.descriptionBgColor = '#ffe4e4';
      this.description =
        'Harjoittelusi on ollut viime aikoina selv??sti v??h??isemp????, mik?? voi nostaa riski?? vammoille harjoitteluun palatessa. Pid?? huolta, ett?? palaat harjoitteluun maltilla.';
    } else if (this.summary.ratio > 1.5) {
      this.descriptionBgColor = '#ffe4e4';
      this.description =
        'Olet harjoitellut viime aikoina selv??sti tavallista enemm??n, mik?? voi nostaa riski?? vammoille. Varmista, ettet nosta harjoittelun m????r???? tai intensiteetti?? liian nopeasti.';
    } else if (this.summary.ratio > 1.3) {
      this.descriptionBgColor = '#ffffdb';
      this.description =
        'Harjoittelusi on ollut selke??ss?? kasvussa ja olet jo hieman optimaalisen tason yl??puolella.  Varmista, ettet nosta harjoittelun m????r???? tai intensiteetti?? liian nopeasti.';
    } else if (this.summary.ratio < 0.8) {
      this.descriptionBgColor = '#ffffdb';
      this.description =
        'Olet harjoitellut normaalia v??hemm??n tai kevyemmin. Pid?? huolta, ett?? palaat harjoitteluun maltillisesti.';
    } else if (this.summary.ratio > 1.0) {
      this.descriptionBgColor = '#e7ffe7';
      this.description =
        'Kuormitustilasi on tasapainossa ja harjoittelusi on ollut viime aikoina nousujohteista.';
    } else if (this.summary.ratio <= 1.0) {
      this.descriptionBgColor = '#e7ffe7';
      this.description =
        'Kuormitustilasi on tasapainossa ja harjoittelusi on ollut viime aikoina hieman normaalia kevyemp????.';
    }
  }
}
