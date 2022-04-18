import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Session } from 'src/app/core/interfaces/Session';
import { SessionApiService } from 'src/app/core/services/session-api.service';

@Component({
  selector: 'app-edit-session-dialog',
  templateUrl: './edit-session-dialog.component.html',
  styleUrls: ['./edit-session-dialog.component.css'],
})
export class EditSessionDialogComponent implements OnInit {
  sessionEditForm!: FormGroup;
  session: Session;
  today: string = new Date().toISOString();

  constructor(
    private sessionApiService: SessionApiService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Session
  ) {
    this.session = data;
  }

  ngOnInit() {
    this.sessionEditForm = this.fb.group({
      date: [this.session.date, Validators.required],
      duration: [this.session.duration, [Validators.required, Validators.min(1), Validators.max(4320)]],
      rpe: [this.session.rpe, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
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
    this.sessionEditForm.patchValue(patchObject);
  }

  save(): void {
    // Copy original session and update the copy
    const updatedSession = Object.assign(
      {
        ...this.session,
      },
      {
        ...this.sessionEditForm.value,
        date: this.sessionEditForm.value.date.format('Y-MM-DD'),
      }
    );

    try {
      this.sessionApiService.editSession(updatedSession).subscribe();

      // Update values in table
      Object.assign(this.session, updatedSession);

      this.dialogRef.close({ updated: true });
    } catch (error) {
      console.log(error)

      this.close('Virhe harjoitusta päivittäessä.')
    }
  }

  close(message?: string): void {
    this.dialogRef.close({ updated: false, message: message });
  }
}
