import { TestBed } from '@angular/core/testing';

import { IntelisearchService } from './intelisearch.service';

describe('IntelisearchService', () => {
  let service: IntelisearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntelisearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
