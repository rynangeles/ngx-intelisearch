import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, Subject, merge, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'ngb-intelisearch[name]',
  templateUrl: './ngb-intelisearch.component.html',
  styleUrls: ['./ngb-intelisearch.component.scss']
})
export class NgbIntelisearchComponent implements OnInit {
  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('typehead', { static: false }) typehead: NgbTypeahead;
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
  inputModel: string = '';

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

  getInputPlaceholder(token) {
    let placeholder = 'Search';
    switch (token.length) {
      case Token.Logical:
        placeholder = 'Seach Logical Operator';
        break;
      case Token.Key:
        placeholder = 'Seach Key';
        break;
      case Token.Operator:
        placeholder = 'Seach Comparison Operator';
        break;
      case Token.Value:
        placeholder = 'Seach Value';
        break;
      default:
        placeholder = 'Seach...';
        break;
    }
    return placeholder;
  }
  /*
  TODO:
  inspect how tokens and queries produced
  */
  onTypeheadKeydown(evt?) {
    const keyCode = (evt.which) ? evt.which : evt.keyCode;
    switch (keyCode) {
      case KeyCode.Enter:
        if (this.inputModel.length > 0) {
          evt.preventDefault();
          this.search.emit([...this.tokens, [this.inputModel]]);
        }
        if (this.tokens.length > 1 && this.token.length === 0) {
          evt.preventDefault();
          this.search.emit(this.tokens);
          this.saveSearchTokens();
        }
        break;
      case KeyCode.Backspace:
        if (!this.inputModel.length) {
          evt.preventDefault();
          this.input.nativeElement.blur();
          if (!this.token.length && this.tokens.indexOf(this.token) !== 0) {
            this.tokens.pop();
            this.token = _.last(this.tokens);
          }
          this.inputModel = this.token.pop() || '';
          if (this.tokens.length === 1 && this.token.length === 0) {
            this.tokens.pop();
            this.addToken();
          }
          setTimeout(() => this.input.nativeElement.focus());
        }
        break;
      default:
        break;
    }
  }

  tokenSearch() {
    return (text$: Observable<string>) => {
      const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
      const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.typehead.isPopupOpen()));
      const inputFocus$ = this.focus$;
      return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$)
        .pipe(
          switchMap(term => {
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
            return $observable.pipe(map(list => ({ list, term })));
          }),
          map(({ list, term }) => {
            return _.chain(list)
              .filter(item => item.toString().toLowerCase().indexOf(term.toLowerCase()) >= 0)
              .uniq()
              .slice(0, 10)
              .value();
          })
        );
    }
  }

  tokenHandler(evt) {
    evt.preventDefault();
    const { value } = evt.item;
    this.input.nativeElement.blur();
    this.token.push(value);
    this.inputModel = '';
    if (this.token.indexOf(value) === Token.Value) {
      this.addToken();
    }
    setTimeout(() => this.input.nativeElement.focus());
  }

  selectToken(idx) {
    const token = this.tokens[idx];
    if (token.length === EnumLength(Token)) {
      this.input.nativeElement.blur();
      this.tokens.pop();
      this.token = token;
      this.inputModel = this.token.pop();
      setTimeout(() => this.input.nativeElement.focus());
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
