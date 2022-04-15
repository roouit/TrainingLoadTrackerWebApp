import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegisterDTO } from 'src/app/core/interfaces/UserRegisterDTO';
import { UserApiService } from 'src/app/core/services/user-api.service';
import { WorkloadCalculateMethod } from '../../../interfaces/LoadingStatusSnapshotDTO'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerRequest: UserRegisterDTO;
  registerForm!: FormGroup;
  setError!: Function;
  setMessage!: Function;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private router: Router
  ) {
    this.registerRequest = {
      password: '',
      email: '',
      acuteRange: 7,
      chronicRange: 28,
      calculationMethod: WorkloadCalculateMethod.ExponentiallyWeightedMovingAverage
    };
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      password: [
        this.registerRequest.password,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(55),
        ],
      ],
      email: [
        this.registerRequest.email,
        [Validators.required, Validators.email, Validators.maxLength(256)],
      ],
      acuteRange: [
        this.registerRequest.acuteRange,
        [Validators.required, Validators.min(3), Validators.max(14)],
      ],
      chronicRange: [
        this.registerRequest.chronicRange,
        [Validators.required, Validators.min(7), Validators.max(50)],
      ],
      calculationMethod: [
        this.registerRequest.calculationMethod,
        [Validators.required, Validators.min(0), Validators.max(1)],
      ],
    });
  }

  onSubmit() {
    const temp = Object.assign(this.registerRequest, this.registerForm.value);
    console.log(temp);
    this.userApiService.register(temp).subscribe({
      next: (data) => {
        this.setMessage('Registration successful. You can now login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => this.handleError(err),
    });
  }

  handleError(err: any): void {
    if (this.setError) {
      this.setError(err.error)
    }
  }

  getErrorMessage(formKey: string): string | void {
    if (this.registerForm.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    } else if (this.registerForm.get(formKey)?.hasError('email')) {
      return `Sähköposti ei ole kunnollinen`;
    }
    switch (formKey) {
      case 'password':
        if (this.registerForm.get(formKey)?.hasError('minlength')) {
          return `Salasanassa pitää olla vähintään 8 merkkiä`;
        } else if (this.registerForm.get(formKey)?.hasError('maxlength')) {
          return `Salasanassa ei saa olla yli 55 merkkiä`;
        }
        break;
      case 'email':
        if (this.registerForm.get(formKey)?.hasError('maxlength')) {
          return `Sähköpostissa ei saa olla yli 256 merkkiä`;
        }
        break;
      default:
        break;
    }
  }
}
