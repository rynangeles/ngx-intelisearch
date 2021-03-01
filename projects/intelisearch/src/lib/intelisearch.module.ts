import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { TypeaheadDirective } from './typeahead.directive';
import { IntelisearchComponent } from './intelisearch.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [IntelisearchComponent, TypeaheadDirective, DropdownDirective],
  imports: [
    CommonModule
  ],
  exports: [IntelisearchComponent, TypeaheadDirective]
})
export class IntelisearchModule { }
