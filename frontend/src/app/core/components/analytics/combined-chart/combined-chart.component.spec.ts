import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedChartComponent } from './combined-chart.component';

describe('CombinedChartComponent', () => {
  let component: CombinedChartComponent;
  let fixture: ComponentFixture<CombinedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinedChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
