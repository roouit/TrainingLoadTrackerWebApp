// Third party modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Services
import { SessionApiService } from './core/services/session-api.service';

// Components
import { AppComponent } from './app.component';
import { SessionListComponent } from './core/components/session-list/session-list.component';
import { LandingPageComponent } from './core/components/landing-page/landing-page.component';
import { DataTableComponent } from './core/components/session-list/data-table/data-table.component';
import { AddSessionComponent } from './core/components/landing-page/add-session/add-session.component';
import { EditSessionDialogComponent } from './core/components/session-list/edit-session-dialog/edit-session-dialog.component';
import { HeaderComponent } from './core/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    SessionListComponent,
    LandingPageComponent,
    DataTableComponent,
    AddSessionComponent,
    EditSessionDialogComponent,
    HeaderComponent,
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
  ],
  providers: [SessionApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
