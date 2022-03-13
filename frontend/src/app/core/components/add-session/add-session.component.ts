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
  addSessionForm = this.fb.group({
    date: [new Date().toISOString(), Validators.required],
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

    this.sessionApiService
      .addSession(newSessionCandidate)
      .subscribe((data) => console.log(data));
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
