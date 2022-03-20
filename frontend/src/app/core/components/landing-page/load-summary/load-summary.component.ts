import { Component, OnInit } from '@angular/core';
import { LoadSummaryDTO } from 'src/app/core/interfaces/LoadSummaryDTO';
import { SessionApiService } from 'src/app/core/services/session-api.service';

@Component({
  selector: 'app-load-summary',
  templateUrl: './load-summary.component.html',
  styleUrls: ['./load-summary.component.css']
})
export class LoadSummaryComponent implements OnInit {
  summary!: LoadSummaryDTO;
  description: string = '';
  descriptionBgColor: string = 'white'

  constructor(private sessionApiService: SessionApiService) {
    this.summary = {
      acute: 0,
      chronic: 0,
      ratio: 0,
      method: 0
    }
   }

  ngOnInit(): void {
    this.sessionApiService.getLoadSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.setDescription();
        console.log(data);
      },
      error: (error) => console.log(error),
    });
  }

  getRoundedRatio(): number {
    if (Object.keys(this.summary).length === 0) return 0;
    const numString = this.summary.ratio as unknown as string
    return +(Math.round(parseFloat(numString + 'e+2')) + 'e-2');
  }

  getRatioColor(): string {
    if (Object.keys(this.summary).length === 0) return 'black';
    // Optimal (0.8 - 1.3)
    if (this.summary.ratio >= 0.8 && this.summary.ratio <= 1.3) {
      return 'green';
    // Danger (over 1.5 or under 0.7)
    } else if (this.summary.ratio < 0.7 || this.summary.ratio > 1.5) {
       return 'red';
    }
    // Warning (0.7 - 0.8 or 1.3 - 1.5)
    return '#ffd000';
  }

  setDescription(): void {
    if (this.summary.ratio < 0.7) {
      this.descriptionBgColor = '#ffe4e4';
      this.description =
        'Harjoittelusi on ollut viime aikoina selvästi vähäisempää, mikä voi nostaa riskiä vammoille harjoitteluun palatessa. Pidä huolta, että palaat harjoitteluun maltilla.';
    } else if (this.summary.ratio > 1.5) {
      this.descriptionBgColor = '#ffe4e4';
      this.description =
        'Olet harjoitellut viime aikoina selvästi tavallista enemmän, mikä voi nostaa riskiä vammoille. Varmista, ettet nosta harjoittelun määrää tai intensiteettiä liian nopeasti.';
    } else if (this.summary.ratio > 1.3) {
      this.descriptionBgColor = '#ffffdb';
      this.description =
        'Harjoittelusi on ollut selkeässä kasvussa ja olet jo hieman optimaalisen tason yläpuolella.  Varmista, ettet nosta harjoittelun määrää tai intensiteettiä liian nopeasti.';
    } else if (this.summary.ratio < 0.8) {
      this.descriptionBgColor = '#ffffdb';
      this.description = 
        'Olet harjoitellut normaalia vähemmän tai kevyemmin. Pidä huolta, että palaat harjoitteluun maltillisesti.';
    } else if (this.summary.ratio > 1.0) {
      this.descriptionBgColor = '#e7ffe7';
      this.description =
        'Kuormitustilasi on tasapainossa ja harjoittelusi on ollut viime aikoina nousujohteista.';
    } else if (this.summary.ratio < 1.0) {
      this.descriptionBgColor = '#e7ffe7';
      this.description =
        'Kuormitustilasi on tasapainossa ja harjoittelusi on ollut viime aikoina hieman normaalia kevyempää.';
    }
  }
}
