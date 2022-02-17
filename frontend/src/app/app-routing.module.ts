import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { SessionListComponent } from './core/components/session-list/session-list.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'sessions', component: SessionListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
