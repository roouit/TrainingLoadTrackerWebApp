// Third party modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSliderModule } from '@angular/material/slider';

// Services
import { SessionApiService } from './core/services/session-api.service';
import { UserApiService } from './core/services/user-api.service';
import { TokenInterceptorService } from './core/services/token-interceptor.service';

// Guards
import { AuthGuard } from './core/guards/auth.guard';

// Components
import { AppComponent } from './app.component';
import { SessionListComponent } from './core/components/session-list/session-list.component';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { DataTableComponent } from './core/components/session-list/data-table/data-table.component';
import { AddSessionComponent } from './core/components/add-session/add-session.component';
import { EditSessionDialogComponent } from './core/components/session-list/edit-session-dialog/edit-session-dialog.component';
import { HeaderComponent } from './core/components/header/header.component';
import { RegisterComponent } from './core/components/auth/register/register.component';
import { LoginComponent } from './core/components/auth/login/login.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    SessionListComponent,
    LandingPageComponent,
    DataTableComponent,
    AddSessionComponent,
    EditSessionDialogComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSliderModule,
  ],
  providers: [
    SessionApiService,
    UserApiService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'fi' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
