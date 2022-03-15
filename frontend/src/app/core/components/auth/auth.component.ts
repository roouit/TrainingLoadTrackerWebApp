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
  errorMessage: string = '';
  genericMessage: string = '';

  constructor() {}

  ngOnInit(): void {}

  setError = (message: string): void => {
    this.errorMessage = message;
  };

  setMessage = (message: string): void => {
    this.genericMessage = message;
  };

  resetError = (): void => {
    this.errorMessage = '';
  };

  resetMessage = (): void => {
    this.genericMessage = '';
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
