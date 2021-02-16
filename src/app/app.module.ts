import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbIntelisearchModule } from 'ngb-intelisearch';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbIntelisearchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
