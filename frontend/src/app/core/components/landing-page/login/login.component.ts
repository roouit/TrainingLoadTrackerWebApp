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

  constructor(private fb: FormBuilder, private userApiService: UserApiService, private router: Router) {
    this.loginRequest = {
      username: '',
      password: '',
    };
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [this.loginRequest.username, Validators.required],
      password: [this.loginRequest.password, Validators.required],
    });
  }

  onSubmit() {
    this.userApiService
      .login(Object.assign(this.loginRequest, this.loginForm.value))
      .subscribe({
        next: (token) => {
          localStorage.setItem('token', token);
          this.router.navigate([''])
        },
        error: (err) => console.log(err),
      });
  }
}