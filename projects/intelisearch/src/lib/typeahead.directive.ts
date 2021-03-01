import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from "@angular/core";
import * as Autocomplete from '@tarekraafat/autocomplete.js';
import { createPopper } from '@popperjs/core';
import { Observable } from "rxjs";

@Directive({
  selector: 'input[typeahead]',
  exportAs: 'typeahead'
})
export class TypeaheadDirective implements OnInit {
  @Input('key') private key: string;
  @Input('label') private label: string;
  @Input('container') private container: string;
  @Input('typeahead') private source: (text: string) => Observable<any>;
  @Output('selectItem') private onSelection: EventEmitter<any> = new EventEmitter();
  private ele: HTMLElement;
  private instance: Autocomplete;
  get selector() {
    return this.instance.selector();
  }
  get value() {
    return this.selector.value;
  }
  set value(value) {
    this.selector.value = value;
  }
  constructor(eleRef: ElementRef) {
    this.ele = eleRef.nativeElement;
  }
  ngOnInit() {
    this.instance = new Autocomplete({
      selector: () => this.ele,
      highlight: true,
      data: {
        src: async () => await this.source(this.value).toPromise(),
        key: [this.key || 'value'],
      },
      resultsList: {
        destination: this.container,
        className: 'typeahead-list',
        idName: `typeahead-list-${new Date().getUTCMilliseconds()}`,
        container: (element) => {
          const input = this.selector;
          createPopper(input, element, { placement: 'bottom-start' });
        }
      },
      resultItem: {
        content: (data, element) => {
          const { value, match } = data;
          const label = this.label || 'label';
          element.innerHTML = `<div>${match}</div>${label && value[label] ? `<div>${value[label]}</div>` : ''}`;
        },
        className: 'typeahead-item',
        idName: 'typeahead-item'
      },
      onSelection: (data) => this.onSelection.emit(data),
      trigger: {
        event: ['input', 'focus'],
        condition: () => true
      },
      debounce: this.ele.getAttribute('debounce') || 0
    });
  }
}