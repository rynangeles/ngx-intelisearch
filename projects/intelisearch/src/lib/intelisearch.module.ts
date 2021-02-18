import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { TypeaheadDirective } from './typeahead.directive';
import { IntelisearchComponent } from './intelisearch.component';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [IntelisearchComponent, TypeaheadDirective, DropdownDirective],
  imports: [
    BrowserModule
  ],
  exports: [IntelisearchComponent, TypeaheadDirective, DropdownDirective]
})
export class IntelisearchModule { }
