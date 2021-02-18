import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import * as _ from 'lodash';

import { TypeaheadDirective } from './typeahead.directive';
enum Token {
  Logical,
  Key,
  Operator,
  Value
}
enum KeyCode {
  Enter = 13,
  Backspace = 8
};

const EnumLength = Enum => {
  return Object.keys(Enum).map(val => Number(isNaN(Number(val)))).reduce((a, b) => a + b, 0);
}

@Component({
  selector: 'intelisearch[name]',
  templateUrl: './intelisearch.component.html',
  styleUrls: ['./intelisearch.component.scss']
})
export class IntelisearchComponent implements OnInit, AfterViewInit {
  @ViewChild('typeahead') typeahead: TypeaheadDirective;
  @Input() name: string;
  @Input() keys: (value: any) => Observable<any>;
  @Input() values: (value: any) => Observable<any>;
  @Input() logical: (value: any) => Observable<any> = () => of([
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' }
  ]);
  @Input() comparison: (value: any) => Observable<any> = () => of([
    { value: '=', label: 'equal' },
    { value: '!=', label: 'not equal' },
    { value: 'LIKE', label: 'contains' },
    { value: '>', label: 'greater than' },
    { value: '<', label: 'less than' }
  ]);
  @Output() search: EventEmitter<any> = new EventEmitter();
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  searchTokens: any[];
  tokens: any[] = [];
  token: string[];
  typeaheadInputModel: string = '';

  constructor() {
    this.tokenSearch = this.tokenSearch.bind(this);
  }

  inputFormatter = (input: { value: string }) => input.value;

  addToken() {
    const token = this.tokens.length ? [] : [null];
    this.tokens.push(token);
    this.token = this.tokens[this.tokens.indexOf(token)];
  }

  ngOnInit() {
    this.addToken();
    this.getSearchTokens();

  }
  ngAfterViewInit() {

  }

  saveSearchTokens() {
    const tokens = this.getSearchTokens();
    tokens.push(_.filter(this.tokens, token => token.length));
    window.localStorage.setItem(`sf:${this.name}`, JSON.stringify(_.takeRight(tokens, 5)));
  }

  getSearchTokens() {
    const tokens = window.localStorage.getItem(`sf:${this.name}`);
    this.searchTokens = JSON.parse(tokens) || [];
    return this.searchTokens;
  }

  clearSearchTokens() {
    window.localStorage.removeItem(`sf:${this.name}`);
    this.getSearchTokens();
  }

  tokensToString(tokens) {
    return _.map(tokens, i => i.join('')).join('&');
  }

  onSelectRecentSearch(tokens) {
    this.tokens = tokens;
    this.addToken();
    this.search.emit(this.tokens);
  }

  /*
  TODO:
  inspect how tokens and queries produced
  */
  onTypeheadKeydown(evt?) {
    const keyCode = (evt.which) ? evt.which : evt.keyCode;
    switch (keyCode) {
      case KeyCode.Enter:
        if (this.typeaheadInputModel.length > 0) {
          evt.preventDefault();
          this.search.emit([...this.tokens, [this.typeaheadInputModel]]);
        }
        if (this.tokens.length > 1 && this.token.length === 0) {
          evt.preventDefault();
          this.search.emit(this.tokens);
          this.saveSearchTokens();
        }
        break;
      case KeyCode.Backspace:
        if (!this.typeaheadInputModel.length) {
          evt.preventDefault();
          this.typeahead.instance.selector().blur();
          if (!this.token.length && this.tokens.indexOf(this.token) !== 0) {
            this.tokens.pop();
            this.token = _.last(this.tokens);
          }
          this.typeaheadInputModel = this.token.pop() || '';
          if (this.tokens.length === 1 && this.token.length === 0) {
            this.tokens.pop();
            this.addToken();
          }
          setTimeout(() => this.typeahead.instance.selector().focus(), 0);
        }
        break;
      default:
        break;
    }
  }
  tokenSearch() {
    return (term: string) => {
      let $observable: Observable<any>;
      switch (this.token.length) {
        case Token.Logical:
          $observable = this.logical({ type: 'LOGICAL', property: null, term, count: 10 });
          break;
        case Token.Key:
          $observable = this.keys({ type: 'KEY', property: null, term, count: 10 });
          break;
        case Token.Operator:
          $observable = this.comparison({ type: 'COMPARISON', property: null, term, count: 10 });
          break;
        case Token.Value:
          $observable = this.values({ type: 'VALUE', property: this.token[Token.Key], term, count: 10 });
          break;
        default:
          $observable = of([]);
          break;
      }
      return $observable;
    }
  }
  tokenHandler({ selection }) {
    this.typeahead.instance.selector().blur();
    const value = selection.value[selection.key];
    this.token.push(value);
    this.typeaheadInputModel = '';
    if (this.token.indexOf(value) === Token.Value) this.addToken();
    setTimeout(() => this.typeahead.instance.selector().focus(), 0);
  }

  selectToken(idx) {
    const token = this.tokens[idx];
    if (token.length === EnumLength(Token)) {
      this.typeahead.instance.selector().blur();
      this.tokens.pop();
      this.token = token;
      this.typeaheadInputModel = this.token.pop();
      setTimeout(() => this.typeahead.instance.selector(), 0);
    }
  }

  removeToken(idx) {
    this.tokens.splice(idx, 1);
    this.search.emit(this.tokens);
  }

  clearTokens() {
    this.tokens.length = 0;
    this.search.emit(this.tokens);
    this.addToken();
  }
}
