import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-calculations',
  templateUrl: './update-calculations.component.html',
  styleUrls: ['./update-calculations.component.css'],
})
export class UpdateCalculationsComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      acuteRange: [7, Validators.required],
      chronicRange: [28, Validators.required],
      calculationMethod: ['rollingaverage', Validators.required],
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
