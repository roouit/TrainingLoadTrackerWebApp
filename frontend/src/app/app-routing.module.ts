import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSessionComponent } from './core/components/add-session/add-session.component';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { RegisterComponent } from './core/components/landing-page/register/register.component';
import { SessionListComponent } from './core/components/session-list/session-list.component';

const routes: Routes = [
  { path: '', component: AddSessionComponent },
  { path: 'sessions', component: SessionListComponent },
  // { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
