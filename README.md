


# Ngb-inteliseach

Angular library for inteligent search input with save recent search feature.

## Demo

Check the demo site on how it works [https://rynangeles.github.io/ngb-intelisearch/]([https://rynangeles.github.io/ngb-intelisearch/])

## Dependencies

This library has four dependencies. [ng-bootstrap](https://github.com/ng-bootstrap/ng-bootstrap), [bootstrap 4](https://getbootstrap.com/), [lodash](https://lodash.com/) and [lineawesome](https://icons8.com/line-awesome)

## Installation

This library is published in Github Packages. 

> npm install @rynangeles/ngb-intelisearch

This will also install peer dependencies automatically.

###  Import the module
    import { NgbIntelisearchModule } from  'ngb-intelisearch';

	@NgModule({
		imports: [
			NgbIntelisearchModule
		]
	})
	export  class  AppModule { }

## Usage

> app.component.html

	<ngb-intelisearch  name="intelisearch"  (search)="search($event)"  [keys]="getKeys"  [values]="getValues"></ngb-intelisearch>
> app.component.ts

	

    import { Component } from '@angular/core';
    import { Observable, of } from 'rxjs';
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.scss']
    })
    export class AppComponent {
      constructor() {
        this.getKeys = this.getKeys.bind(this);
        this.getValues = this.getValues.bind(this);
      }
    
      query: any;
    
      data: any = {
        gender: [
          { value: 'M' },
          { value: 'F' }
        ],
        name: [
          { value: `Inaaya Ramsay` },
          { value: `Connar Parra` },
          { value: `Mike Shah` },
          { value: `Ariyan Winter` },
          { value: `Meredith Ward` },
        ],
        username: [
          { value: 'kentish' },
          { value: 'turban' },
          { value: 'favorable' },
          { value: 'breathe' },
          { value: 'rufous' }
        ]
      }
    
      getKeys(evt): Observable<any[]> {
        return evt.type === 'KEY' ? of(Object.keys(this.data).map(value => ({ value }))) : of([]);
      }
    
      getValues(evt): Observable<any[]> {
        return evt.type === 'VALUE' ? of(this.data[evt.property]) : of([]);
      }
    
      search(evt) {
        this.query = evt;
      }
    }

## API
### Inputs 
| | | |
|--|--|--|
| **name** | required | Name of the instance. *type: String* |
| **keys** | required | List of properties of the collection to search. *type: Observable<{value:any, label:string}[]* |
| **values** | required | List of values based on the selected property of the collection. *type: Observable<{value:any, label:string}[]* |
| **logical** | optional | List of logical operators. *type: Observable<{value:any, label:string}[]>* |
| **comparison** | optional | List of comparison operators. *type: Observable<{value:any, label:string}[]* |

### Outputs 
| | | |
|--|--|--|
| search | required | Function to seach the collection. |

