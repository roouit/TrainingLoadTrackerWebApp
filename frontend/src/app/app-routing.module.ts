import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { LoginComponent } from './core/components/auth/login/login.component';
import { RegisterComponent } from './core/components/auth/register/register.component';
import { SessionListComponent } from './core/components/session-list/session-list.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthComponent } from './core/components/auth/auth.component';
import { AnalyticsComponent } from './core/components/analytics/analytics.component';
import { SettingsComponent } from './core/components/settings/settings.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [AuthGuard] },
  {
    path: 'sessions',
    component: SessionListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'analyze',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
