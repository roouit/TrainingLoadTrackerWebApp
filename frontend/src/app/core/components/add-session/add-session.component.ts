import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SessionApiService } from 'src/app/core/services/session-api.service';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css'],
})
export class AddSessionComponent implements OnInit {
  title: string = 'Uusi harjoitus';
  today: string = new Date().toISOString();
  genericMessage: string = '';
  errorMessage: string = '';
  addSessionForm = this.fb.group({
    date: [this.today, Validators.required],
    duration: [
      0,
      [Validators.required, Validators.min(1), Validators.max(4320)],
    ],
    rpe: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  constructor(
    private fb: FormBuilder,
    private sessionApiService: SessionApiService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const newSessionCandidate = {
      date: this.addSessionForm.value.date,
      duration: this.addSessionForm.value.duration,
      rpe: this.addSessionForm.value.rpe,
    };

    this.sessionApiService.addSession(newSessionCandidate).subscribe({
      next: (data) => {
        this.resetMessages();
        this.genericMessage = 'Uusi harjoitus lisätty!';
        this.resetForm();
      },
      error: (err) => {
        const property = Object.keys(err.error.errors)[0]
        this.resetMessages();
        this.errorMessage = `Virhe harjoitusta lisättäessä: ${
          err.error.errors[property] ?? 'tuntematon virhe'
        }`;
      },
    });
  }

  resetForm(): void {
    this.addSessionForm.setValue({
      date: this.today,
      duration: 0,
      rpe: 0,
    });
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.genericMessage = '';
  }

  onSliderChange(event: any) {
    this.updateFormValue(
      event.source._elementRef.nativeElement.id,
      event.value
    );
  }

  onInputChange(event: any) {
    if (event.data === null || ',.'.includes(event.data)) return;

    const inputId = event.srcElement.id;
    const inputValue: number = Math.round(event.srcElement.value);
    let validatedValue: number = inputValue;

    if (inputId === 'duration') {
      validatedValue = Math.min(Math.max(inputValue, 1), 4320);
    } else if (inputId === 'rpe') {
      validatedValue = Math.min(Math.max(inputValue, 1), 10);
    }

    this.updateFormValue(inputId, validatedValue);
  }

  updateFormValue(target: string, value: any) {
    const patchObject: any = {};
    patchObject[target] = value;
    this.addSessionForm.patchValue(patchObject);
  }
}
