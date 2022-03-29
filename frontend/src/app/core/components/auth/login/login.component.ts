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
      username: '',
      password: '',
    };
  }

  autoLogin(): void {
    // Valid until 29.6.
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicm9vcGUiLCJleHAiOjE2NTYzMzIxNDEsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzI4NiIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6NzI4NiJ9.BX3C1f8BrRmt_sH-b1WMzsoHlIC0PLLPg-87TwVuXNGWimKWjEPX65T-Xh6uVft9ICMEuxEgPQCxUsoTKOWLOg'
    );
    this.router.navigate(['']);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [this.loginRequest.username, Validators.required],
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
