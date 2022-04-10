import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginDTO } from 'src/app/core/interfaces/UserLoginDTO';
import { UserApiService } from 'src/app/core/services/user-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginRequest: UserLoginDTO;
  loginForm!: FormGroup;
  setError!: Function;
  setMessage!: Function;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService,
    private router: Router
  ) {
    this.loginRequest = {
      email: '',
      password: '',
    };
  }

  autoLogin(): void {
    // Valid until 9.6.
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJyb291aXRAZ21haWwuY29tIiwiZXhwIjoxNjU0Nzc4MTAwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjcyODYiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjcyODYifQ.Krx7EcfWDWuXpmkKJPGa_GQE0n1uaJyeUHcnkZ2w753XO54bNBrrsYjFWN-H3_cAzoWgp9b9rnfVibcS5AtzGw'
    );
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [this.loginRequest.email, Validators.required],
      password: [this.loginRequest.password, Validators.required],
    });
  }

  onSubmit(): void {
    this.userApiService
      .login(Object.assign(this.loginRequest, this.loginForm.value))
      .subscribe({
        next: (token) => {
          localStorage.setItem('token', token);
          this.router.navigate(['']);
        },
        error: (err) => this.handleError(err),
      });
  }

  handleError(err: any): void {
    if (this.setError) {
      this.setError(err.error);
    }
  }

  getErrorMessage(formKey: string): string | void {
    if (this.loginForm.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    }
  }
}
