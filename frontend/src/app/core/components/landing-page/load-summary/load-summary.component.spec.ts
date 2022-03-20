import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadSummaryComponent } from './load-summary.component';

describe('LoadSummaryComponent', () => {
  let component: LoadSummaryComponent;
  let fixture: ComponentFixture<LoadSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
