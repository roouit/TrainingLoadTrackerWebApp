import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkloadCalculateMethod } from 'src/app/core/interfaces/LoadingStatusSnapshotDTO';
import { UserDTO } from 'src/app/core/interfaces/UserDTO';
import { UserApiService } from 'src/app/core/services/user-api.service';

@Component({
  selector: 'app-update-calculations',
  templateUrl: './update-calculations.component.html',
  styleUrls: ['./update-calculations.component.css'],
})
export class UpdateCalculationsComponent implements OnInit {
  @Input() userData!: UserDTO;
  previousUserData!: UserDTO;
  loading: boolean = false;
  loaded: boolean = false;
  changed: boolean = false;
  form!: FormGroup;
  genericMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        acuteRange: [
          0,
          [Validators.required, Validators.min(3), Validators.max(15)],
        ],
        chronicRange: [
          0,
          [Validators.required, Validators.min(7), Validators.max(50)],
        ],
        calculationMethod: [WorkloadCalculateMethod[0], Validators.required],
      },
      {
        validator: this.acuteChronicRelationValidator(
          'acuteRange',
          'chronicRange'
        ),
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData'].currentValue) {
      this.form.setValue({
        acuteRange: this.userData.acuteRange,
        chronicRange: this.userData.chronicRange,
        calculationMethod:
          WorkloadCalculateMethod[this.userData.calculationMethod],
      });
      this.previousUserData = { ...this.userData };
      this.loaded = true;
    }
  }

  acuteChronicRelationValidator(acuteRange: string, chronicRange: string) {
    return (formGroup: FormGroup) => {
      const acute = formGroup.controls[acuteRange];
      const chronic = formGroup.controls[chronicRange];
      if (acute.errors || chronic.errors) {
        return;
      }
      if (acute.value >= chronic.value) {
        acute.setErrors({ higherThanChronic: true });
        chronic.setErrors({ higherThanChronic: true });
      }
    };
  }

  handleChange(event: any): void {
    if (this.genericMessage) {
      this.resetMessages();
    }

    if (
      WorkloadCalculateMethod[this.previousUserData.calculationMethod] ===
        this.form.value.calculationMethod &&
      this.previousUserData.acuteRange === this.form.value.acuteRange &&
      this.previousUserData.chronicRange === this.form.value.chronicRange
    ) {
      this.changed = false;
    } else {
      this.changed = true;
    }
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;

    this.resetMessages();
    this.userApiService
      .update({
        acuteRange: this.form.value.acuteRange,
        chronicRange: this.form.value.chronicRange,
        calculationMethod: this.form.value.calculationMethod,
      })
      .subscribe({
        next: (data) => {
          this.updateCalculationReliabilityStatus();
          this.resetMessages();
          this.genericMessage = 'Tiedot päivitetty';
          this.previousUserData.acuteRange = this.form.value.acuteRange;
          this.previousUserData.chronicRange = this.form.value.chronicRange;
          this.previousUserData.calculationMethod = Object.values(
            WorkloadCalculateMethod
          ).indexOf(this.form.value.calculationMethod);
          this.changed = false;
          this.loading = false;
        },
        error: (err) => {
          this.resetMessages();
          this.errorMessage = 'Päivitys epäonnistui';
          this.loading = false;
        },
      });
  }

  updateCalculationReliabilityStatus() {
    this.userApiService.getCalculationReliability().subscribe({
      next: (data) => {
        localStorage.setItem('reliableCalculations', String(data.reliable));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.genericMessage = '';
  }

  getErrorMessage(formKey: string): string | void {
    if (this.form.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    }

    if (this.form.get(formKey)?.hasError('min')) {
      return `Arvon pitää olla vähintään ${
        formKey === 'acuteRange' ? 3 : 7
      } päivää`;
    }

    if (this.form.get(formKey)?.hasError('max')) {
      return `Arvo voi olla enintään ${
        formKey === 'acuteRange' ? 15 : 50
      } päivää`;
    }

    if (this.form.get(formKey)?.hasError('higherThanChronic')) {
      return 'Akuutin tulee olla kroonista vähemmän'
    }
  }
}
