import { TestBed } from '@angular/core/testing';

import { NgbIntelisearchService } from './ngb-intelisearch.service';

describe('NgbIntelisearchService', () => {
  let service: NgbIntelisearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgbIntelisearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
