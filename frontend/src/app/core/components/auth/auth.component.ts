import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  title: string = '';
  hasError: boolean = false;
  errorMessage: string = '';
  hasMessage: boolean = false;
  genericMessage: string = '';

  constructor() {}

  ngOnInit(): void {}

  setError = (message: string): void => {
    this.errorMessage = message;
    this.hasError = true;
  };

  setMessage = (message: string): void => {
    this.genericMessage = message;
    this.hasMessage = true;
  };

  resetError = (): void => {
    this.errorMessage = '';
    this.hasError = false;
  };

  resetMessage = (): void => {
    this.genericMessage = '';
    this.hasMessage = false;
  };

  passFunctionsToChild(componentRef: {
    setError: (message: string) => void;
    setMessage: (message: string) => void;
  }) {
    if (componentRef instanceof LoginComponent) {
      this.title = 'Kirjaudu';
      this.resetError();
    } else if (componentRef instanceof RegisterComponent) {
      this.title = 'Rekisteröidy';
      this.resetError();
      this.resetMessage();
    } else {
      return;
    }

    componentRef.setError = this.setError;
    componentRef.setMessage = this.setMessage;
  }
}
