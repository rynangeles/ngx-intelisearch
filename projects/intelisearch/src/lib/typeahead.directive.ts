import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from "@angular/core";
import * as Autocomplete from '@tarekraafat/autocomplete.js';
import { createPopper } from '@popperjs/core';
import { Observable } from "rxjs";

@Directive({
  selector: 'input[typeahead]',
  exportAs: 'typeahead'
})
export class TypeaheadDirective {
  @Input('typeahead') private source: (text: string) => Observable<any>;
  @Output('selectItem') private onSelection: EventEmitter<any> = new EventEmitter();
  instance: Autocomplete;
  constructor(eleRef: ElementRef) {
    const { nativeElement: ele } = eleRef;
    this.instance = new Autocomplete({
      selector: () => ele,
      highlight: true,
      data: {
        src: async () => await this.source(this.instance.selector().value).toPromise(),
        key: ['value'], // @input
      },
      resultsList: {
        destination: ele.getAttribute('container'),
        className: 'typeahead-list',
        idName: `typeahead-list-${new Date().getUTCMilliseconds()}`,
        container: (element) => {
          const input = this.instance.selector();
          createPopper(input, element, { placement: 'bottom-start' });
        }
      },
      resultItem: {
        content: (data, element) => {
          const { value, match } = data;
          const alias = 'label'; // @input
          element.innerHTML = `<div>${match}</div>${alias && value[alias] ? `<div>${value[alias]}</div>` : ''}`;
        },
        className: 'typeahead-item',
        idName: 'typeahead-item'
      },
      onSelection: (data) => this.onSelection.emit(data),
      trigger: {
        event: ['input', 'focus'],
        condition: () => true
      },
      debounce: ele.getAttribute('debounce') || 0
    });
  }

}