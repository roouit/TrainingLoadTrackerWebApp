import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReliabilityWarningDialogComponent } from './reliability-warning-dialog.component';

describe('ReliabilityWarningDialogComponent', () => {
  let component: ReliabilityWarningDialogComponent;
  let fixture: ComponentFixture<ReliabilityWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReliabilityWarningDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliabilityWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
