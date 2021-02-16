import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbIntelisearchComponent } from './ngb-intelisearch.component';

describe('NgbIntelisearchComponent', () => {
  let component: NgbIntelisearchComponent;
  let fixture: ComponentFixture<NgbIntelisearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbIntelisearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbIntelisearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
