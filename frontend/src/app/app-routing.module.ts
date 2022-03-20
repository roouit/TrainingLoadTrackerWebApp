import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { LoginComponent } from './core/components/auth/login/login.component';
import { RegisterComponent } from './core/components/auth/register/register.component';
import { SessionListComponent } from './core/components/session-list/session-list.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthComponent } from './core/components/auth/auth.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
