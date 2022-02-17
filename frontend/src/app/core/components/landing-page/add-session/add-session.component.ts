import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SessionApiService } from 'src/app/core/services/session-api.service';
import { Session } from '../../../interfaces/Session';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.css'],
})
export class AddSessionComponent implements OnInit {
  addSessionForm = this.fb.group({
    date: [new Date().toISOString(), Validators.required],
    duration: [0, Validators.required],
    rpe: [0, Validators.required],
  });

  constructor(private fb: FormBuilder, private sessionApiService: SessionApiService) {}

  ngOnInit(): void {}

  onSubmit() {
    const newSession: Session = {
      startTime: this.addSessionForm.value.date,
      duration: this.addSessionForm.value.duration,
      rpe: this.addSessionForm.value.rpe,
    };

    this.sessionApiService
      .addSession(newSession)
      .subscribe((data) => console.log(data));
  }
}
