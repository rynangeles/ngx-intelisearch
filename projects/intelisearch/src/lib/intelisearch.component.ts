import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { take } from 'rxjs/operators';
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
export class IntelisearchComponent implements OnInit {
  @ViewChild('typeahead') typeahead: TypeaheadDirective;
  @Input() maxResults: number;
  @Input() name: string;
  @Input() key: string;
  @Input() label: string;
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
  pristine: boolean = true;

  constructor() {
    this.tokenSearch = this.tokenSearch.bind(this);
  }

  private get _isTokensEmpty() {
    return this.tokens.length <= 1 && _.some(this.tokens, token => _.isEmpty(token));
  }

  private get _tokenEntryIndex() {
    return this._isTokensEmpty ? 1 : this.token.length;
  }

  addToken() {
    const token = [];
    this.tokens.push(token);
    this.token = this.tokens[this.tokens.indexOf(token)];
  }

  ngOnInit() {
    this.addToken();
    this.getSearchTokens();

  }

  saveSearchTokens() {
    const tokens = this.getSearchTokens();
    tokens.push(_.filter(this.tokens, token => token.length));
    window.localStorage.setItem(`intelisearch:${this.name}`, JSON.stringify(_.takeRight(tokens, 5)));
  }

  getSearchTokens() {
    const tokens = window.localStorage.getItem(`intelisearch:${this.name}`);
    this.searchTokens = JSON.parse(tokens) || [];
    return this.searchTokens;
  }

  clearSearchTokens() {
    window.localStorage.removeItem(`intelisearch:${this.name}`);
    this.getSearchTokens();
  }

  tokensToString(tokens) {
    return _.map(tokens, i => i.join('')).join('');
  }

  onSelectRecentSearch(tokens) {
    this.tokens = tokens;
    this.addToken();
    this.search.emit(this.tokens);
  }

  get cleanTokens() {
    return _.chain(this.tokens).filter(token => !_.isEmpty(token)).cloneDeep().value();
  }

  onTypeheadKeydown(evt?) {
    const keyCode = (evt.which) ? evt.which : evt.keyCode;
    switch (keyCode) {
      case KeyCode.Enter:
        if (this._isTokensEmpty) {
          this.typeahead.value && this.search.emit(this.typeahead.value);
          this.pristine = false;
        } else {
          switch (this._tokenEntryIndex) {
            case Token.Logical:
              setTimeout(() => {
                if (!this.typeahead.value && _.isEmpty(this.token)) {
                  this.search.emit(this.cleanTokens);
                  this.saveSearchTokens();
                  this.pristine = false;
                }
              });
              break;
            case Token.Value:
              setTimeout(() => this.typeahead.value && this.tokenHandler(this.typeahead.value));
              break;
            default:
              break;
          }
        }
        break;
      case KeyCode.Backspace:
        if (!this.typeahead.value) {
          evt.preventDefault();
          this.typeahead.selector.blur();
          if (this.tokens.indexOf(this.token) > 0 && this.token.length === 0) {
            this.tokens.pop();
            this.token = _.last(this.tokens);
          }
          setTimeout(() => {
            this.typeahead.selector.focus();
            this.typeahead.value = this.token.pop() || '';
            if (this._isTokensEmpty) {
              this.pristine = true;
            }
          });
        }
        break;
      default:
        break;
    }
  }

  tokenSearch() {
    return (term: string) => {
      let $observable: Observable<any>;
      switch (this._tokenEntryIndex) {
        case Token.Logical:
          $observable = this.logical({ type: 'LOGICAL', property: null, term, count: 10 });
          $observable.pipe(take(1)).subscribe(r => this.typeahead.instance.maxResults = r.length);
          break;
        case Token.Key:
          $observable = this.keys({ type: 'KEY', property: null, term, count: 10 });
          $observable.pipe(take(1)).subscribe(r => this.typeahead.instance.maxResults = r.length);
          break;
        case Token.Operator:
          $observable = this.comparison({ type: 'COMPARISON', property: null, term, count: 10 });
          $observable.pipe(take(1)).subscribe(r => this.typeahead.instance.maxResults = r.length);
          break;
        case Token.Value:
          this.typeahead.instance.maxResults = this.maxResults || 5;
          $observable = this.values({ type: 'VALUE', property: this.token[Token.Key], term, count: 10 });
          break;
        default:
          $observable = of([]);
          break;
      }
      return $observable;
    }
  }

  onTypeheadSelectItem({ event, selection }) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.tokenHandler(selection.value[selection.key]);
  }

  tokenHandler(value) {
    this.typeahead.selector.blur();
    this.token.push.apply(this.token, this._isTokensEmpty ? [null, value] : [value]);
    this.typeahead.value = '';
    if (this.token.indexOf(value) === Token.Value) this.addToken();
    this.pristine = false;
    setTimeout(() => this.typeahead.selector.focus(), 0);
  }

  selectToken(idx) {
    if (this.token.length) return;
    const token = this.tokens[idx];
    if (token.length === EnumLength(Token)) {
      this.typeahead.selector.blur();
      this.tokens.pop();
      this.token = token;
      setTimeout(() => {
        this.typeahead.value = this.token.pop();
        this.typeahead.selector.focus();
      });
    }
  }

  removeToken(idx) {
    this.tokens.splice(idx, 1);
    this.search.emit(this.tokens);
  }

  clearTokens() {
    this.tokens.length = 0;
    this.search.emit(this.cleanTokens);
    this.addToken();
    this.pristine = true;
  }
}
