import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionComponent } from './components/session/session.component';
import { ShowSessionComponent } from './components/session/show-session/show-session.component';
import { SessionApiService } from './services/session-api.service';

@NgModule({
  declarations: [AppComponent, SessionComponent, ShowSessionComponent],
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
