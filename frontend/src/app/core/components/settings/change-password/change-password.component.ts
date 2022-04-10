import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordAgain: ['', Validators.required],
    });
  }

  onSubmit(): void {
    // TODO: Implement send
    console.log('lähetä');
  }

  getErrorMessage(formKey: string): string | void {
    // TODO: Implement all validator checks 
    if (this.changePasswordForm.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    }
  }
}
