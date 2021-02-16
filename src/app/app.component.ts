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
      { value: `Rohit Conroy` },
      { value: `Atlanta Salazar` },
      { value: `Darren Barrett` },
      { value: `Faris Duke` },
      { value: `Maisha Mendez` },
      { value: `Gage O'Reilly` },
      { value: `Karter Proctor` },
      { value: `Mattie Gallegos` },
      { value: `Regan Dudley` },
      { value: `Delores Roman` },
      { value: `Mali Sharma` },
      { value: `Jadon Cotton` },
      { value: `Sammy-Jo Wright` },
      { value: `Perry Hilton` },
      { value: `Kianna Hussain` },
      { value: `Amber-Rose Medrano` },
      { value: `Rafael Baxter` },
      { value: `Tarik Shields` },
      { value: `Jaxson Swift` },
      { value: `Dotty Carney` },
      { value: `Lorna Prosser` },
      { value: `Kara Reeves` },
      { value: `Dewey Mac` },
      { value: `Gracey Andrew` },
      { value: `Harold George` },
      { value: `Selina Davie` },
      { value: `Benas Roth` },
      { value: `Giorgia Silva` },
      { value: `Heath Munoz` },
      { value: `Milosz Lutz` },
      { value: `Cayson White` },
      { value: `Elaina Holder` },
      { value: `Alby Hayes` },
      { value: `Mai Kim` },
      { value: `Harvey Joseph` },
      { value: `Isabell Fellows` },
      { value: `Shannan Corrigan` },
      { value: `Marian Wu` },
      { value: `Kellan Hobbs` },
      { value: `Kasper Hale` },
      { value: `Mikolaj Callaghan` },
      { value: `Annalise Buchanan` },
      { value: `Aubrey Palmer` },
      { value: `Nida Frost` },
      { value: `Malakai Goff` }
    ],
    username: [
      { value: 'kentish' },
      { value: 'turban' },
      { value: 'favorable' },
      { value: 'breathe' },
      { value: 'rufous' },
      { value: 'arrive' },
      { value: 'coat' },
      { value: 'chestplate' },
      { value: 'approve' },
      { value: 'creative' },
      { value: 'sway' },
      { value: 'bam' },
      { value: 'peony' },
      { value: 'media' },
      { value: 'humongous' },
      { value: 'shush' },
      { value: 'alarmed' },
      { value: 'gothic' },
      { value: 'recording' },
      { value: 'taverner' },
      { value: 'outside' },
      { value: 'masons' },
      { value: 'numpty' },
      { value: 'metacarpus' },
      { value: 'footman' },
      { value: 'den' },
      { value: 'morning' },
      { value: 'scrape' },
      { value: 'refer' },
      { value: 'sweatshirt' },
      { value: 'perform' },
      { value: 'most' },
      { value: 'gangway' },
      { value: 'biscuits' },
      { value: 'exact' },
      { value: 'jellyfish' },
      { value: 'criticize' },
      { value: 'kiwi' },
      { value: 'command' },
      { value: 'mine' },
      { value: 'field' },
      { value: 'blackening' },
      { value: 'pan' },
      { value: 'unite' },
      { value: 'wheat' },
      { value: 'harmonious' },
      { value: 'writer' },
      { value: 'jaunty' },
      { value: 'tiara' },
      { value: 'wrestler' },
      { value: 'chirp' },
      { value: 'unarmed' },
      { value: 'shaded' },
      { value: 'tension' },
      { value: 'joint' },
      { value: 'character' },
      { value: 'shivering' },
      { value: 'ominous' },
      { value: 'infield' },
      { value: 'fielding' },
      { value: 'blackstone' },
      { value: 'pug' },
      { value: 'dreary' },
      { value: 'opposition' },
      { value: 'somebody' },
      { value: 'wasp' },
      { value: 'multiple' },
      { value: 'pampers' },
      { value: 'mostly' },
      { value: 'pillar' },
      { value: 'used' },
      { value: 'sweets' },
      { value: 'expression' },
      { value: 'caviar' },
      { value: 'fun' },
      { value: 'sneering' },
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
