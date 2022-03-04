import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private userApiService: UserApiService) {
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
        next: data => console.log(data),
        error: err => console.log(err)
      });
  }
}
