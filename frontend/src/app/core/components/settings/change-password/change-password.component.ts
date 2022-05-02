import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from 'src/app/core/services/user-api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup;
  genericMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(55),
          ],
        ],
        newPasswordAgain: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(55),
          ],
        ],
      },
      {
        validator: this.passwordMatchValidator(
          'newPassword',
          'newPasswordAgain'
        ),
      }
    );
  }

  passwordMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['passwordMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    this.resetMessages();
    this.userApiService
      .changePassword({
        currentPassword: this.form.value.currentPassword,
        newPassword: this.form.value.newPassword,
        newPasswordAgain: this.form.value.newPasswordAgain,
      })
      .subscribe({
        next: (data) => {
          this.genericMessage = 'Salasana vaihdettu';
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          if (err.error === 'Password was not correct') {
            this.errorMessage = 'Nykyinen salasana ei ollut oikein';
          } else if (err.error === "Given new passwords don't match") {
            this.errorMessage = 'Uusi salasana oli erilainen toisessa kentässä';
          } else {
            this.errorMessage = 'Salasanan vaihtaminen epäonnistui';
          }
          this.loading = false;
        },
      });
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.genericMessage = '';
  }

  resetForm(): void {
    this.form.reset();
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].setErrors(null);
    });
  }

  getErrorMessage(formKey: string): string | void {
    if (this.form.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    }

    if (this.form.get(formKey)?.hasError('minlength')) {
      return `Salasanassa pitää olla vähintään 8 merkkiä`;
    }

    if (this.form.get(formKey)?.hasError('maxlength')) {
      return `Salasanassa ei saa olla yli 55 merkkiä`;
    }

    if (this.form.get(formKey)?.hasError('confirmedValidator')) {
      return `Salasana eivät täsmää`;
    }
  }
}
