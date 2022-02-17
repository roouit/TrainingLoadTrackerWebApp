import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionApiService } from './core/services/session-api.service';
import { SessionListComponent } from './core/components/session-list/session-list.component';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { DataTableComponent } from './core/components/session-list/data-table/data-table.component';
import { AddSessionComponent } from './core/components/landing-page/add-session/add-session.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionListComponent,
    LandingPageComponent,
    DataTableComponent,
    AddSessionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SessionApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
