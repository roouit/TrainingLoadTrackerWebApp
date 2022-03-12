import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegisterDTO } from 'src/app/core/interfaces/UserRegisterDTO';
import { UserApiService } from 'src/app/core/services/user-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerRequest: UserRegisterDTO;
  registerForm!: FormGroup;
  hasErrors: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private userApiService: UserApiService, private router: Router) {
    this.registerRequest = {
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
    };
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: [
        this.registerRequest.username,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(128),
        ],
      ],
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
      firstName: [this.registerRequest.firstName, Validators.maxLength(128)],
      lastName: [this.registerRequest.lastName, Validators.maxLength(128)],
    });
  }

  onSubmit() {
    this.userApiService
      .register(Object.assign(this.registerRequest, this.registerForm.value))
      .subscribe({
        next: (data) => {
          this.router.navigate(['/login'])
        },
        error: (err) => this.handleError(err),
      });
  }

  handleError(err: any): void {
    this.errorMessage = err.error
    this.hasErrors = true
  }

  getErrorMessage(formKey: string): string | void {
    if (this.registerForm.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    } else if (this.registerForm.get(formKey)?.hasError('email')) {
      return `Sähköposti ei ole kunnollinen`;
    } 
    switch (formKey) {
      case 'username':
        if (this.registerForm.get(formKey)?.hasError('minlength')) {
          return `Tunnuksessa pitää olla vähintään 2 merkkiä`;
        } else if (this.registerForm.get(formKey)?.hasError('maxlength')) {
          return `Tunnuksessa ei saa olla yli 128 merkkiä`;
        }
        break;
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
      case 'firstName':
        if (this.registerForm.get(formKey)?.hasError('maxlength')) {
          return `Etunimessä ei saa olla yli 256 merkkiä`;
        }
        break;
      case 'lastName':
        if (this.registerForm.get(formKey)?.hasError('maxlength')) {
          return `Sukunimessä ei saa olla yli 256 merkkiä`;
        }
        break;
      default:
        break;
    }
  }
}
