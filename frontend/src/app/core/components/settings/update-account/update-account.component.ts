import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from 'src/app/core/interfaces/UserDTO';
import { UserApiService } from 'src/app/core/services/user-api.service';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css'],
})
export class UpdateAccountComponent implements OnInit {
  @Input() userData!: UserDTO;
  previousUserData!: UserDTO;
  loaded: boolean = false;
  changed: boolean = false;
  form!: FormGroup;
  genericMessage: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userApiService: UserApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData'].currentValue) {
      this.form.setValue({
        email: this.userData.email,
      });
      this.previousUserData = { ...this.userData };
      this.loaded = true;
    }
  }

  handleChange(event: any): void {
    if (this.genericMessage) {
      this.resetMessages();
    }

    if (
      this.previousUserData[event.target.name as keyof UserDTO] !==
      event.target.value
    ) {
      this.changed = true;
    } else {
      this.changed = false;
    }
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    this.resetMessages();
    this.userApiService
      .update({
        email: this.form.value.email,
      })
      .subscribe({
        next: (data) => {
          this.resetMessages();
          this.genericMessage = 'Tiedot päivitetty';
          this.previousUserData.email = this.form.value.email;
          this.changed = false;
          this.loading = false;
        },
        error: (err) => {
          this.resetMessages();
          this.errorMessage = 'Päivitys epäonnistui';
          this.loading = false;
        },
      });
  }

  resetMessages(): void {
    this.errorMessage = '';
    this.genericMessage = '';
  }

  getErrorMessage(formKey: string): string | void {
    if (this.form.get(formKey)?.hasError('required')) {
      return `Kenttä ei voi olla tyhjä`;
    } else if (this.form.get(formKey)?.hasError('email')) {
      return 'Sähköposti ei ole kunnollinen';
    }
  }
}
