import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IntelisearchModule } from 'intelisearch';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IntelisearchModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
