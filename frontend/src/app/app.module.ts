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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MtxSliderModule } from '@ng-matero/extensions/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
import { AddSessionComponent } from './core/components/landing-page/add-session/add-session.component';
import { EditSessionDialogComponent } from './core/components/session-list/edit-session-dialog/edit-session-dialog.component';
import { RegisterComponent } from './core/components/auth/register/register.component';
import { LoginComponent } from './core/components/auth/login/login.component';
import { AuthComponent } from './core/components/auth/auth.component';
import { ConfirmDeleteDialogComponent } from './core/components/session-list/confirm-delete-dialog/confirm-delete-dialog.component';
import { LoadSummaryComponent } from './core/components/landing-page/load-summary/load-summary.component';
import { SideNavigationComponent } from './core/components/side-navigation/side-navigation.component';
import { AnalyticsComponent } from './core/components/analytics/analytics.component';
import { CombinedChartComponent } from './core/components/analytics/combined-chart/combined-chart.component';
import { SettingsComponent } from './core/components/settings/settings.component';
import { ChangePasswordComponent } from './core/components/settings/change-password/change-password.component';
import { UpdateAccountComponent } from './core/components/settings/update-account/update-account.component';
import { UpdateCalculationsComponent } from './core/components/settings/update-calculations/update-calculations.component';
import { ConfirmDeleteAccountDialogComponent } from './core/components/settings/confirm-delete-dialog/confirm-delete-dialog.component';
import { RpeHelpDialogComponent } from './core/utils/help-dialogs/rpe-help-dialog/rpe-help-dialog.component';
import { ReliabilityWarningDialogComponent } from './core/utils/help-dialogs/reliability-warning-dialog/reliability-warning-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionListComponent,
    LandingPageComponent,
    DataTableComponent,
    AddSessionComponent,
    EditSessionDialogComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    ConfirmDeleteDialogComponent,
    LoadSummaryComponent,
    SideNavigationComponent,
    AnalyticsComponent,
    CombinedChartComponent,
    SettingsComponent,
    ChangePasswordComponent,
    UpdateAccountComponent,
    UpdateCalculationsComponent,
    ConfirmDeleteAccountDialogComponent,
    RpeHelpDialogComponent,
    ReliabilityWarningDialogComponent,
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
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MtxSliderModule,
    MatExpansionModule,
    MatDividerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
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
