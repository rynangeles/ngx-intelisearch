import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntelisearchComponent } from './intelisearch.component';

describe('IntelisearchComponent', () => {
  let component: IntelisearchComponent;
  let fixture: ComponentFixture<IntelisearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntelisearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelisearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
