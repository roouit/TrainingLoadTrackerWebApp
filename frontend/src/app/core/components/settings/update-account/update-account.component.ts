import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css'],
})
export class UpdateAccountComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['roouit@gmail.com', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    // TODO: Implement send
    console.log('lähetä');
  }

  getErrorMessage(formKey: string): string | void {
    // TODO: Implement all validator checks
    if (this.form.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    }
  }
}
