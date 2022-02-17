import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Session } from 'src/app/core/interfaces/Session';

@Component({
  selector: 'app-edit-session-dialog',
  templateUrl: './edit-session-dialog.component.html',
  styleUrls: ['./edit-session-dialog.component.css'],
})
export class EditSessionDialogComponent implements OnInit {

  sessionEditform!: FormGroup;
  session: Session;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Session
  ) {
    this.session = data;
  }

  ngOnInit() {
    this.sessionEditform = this.fb.group({
      date: [this.session.startTime, Validators.required],
      duration: [this.session.duration, Validators.required],
      rpe: [this.session.rpe, Validators.required],
    });
  }

  save() {
    console.log(this.sessionEditform.value)
    this.dialogRef.close(this.sessionEditform.value);
  }

  close() {
    this.dialogRef.close();
  }
}
