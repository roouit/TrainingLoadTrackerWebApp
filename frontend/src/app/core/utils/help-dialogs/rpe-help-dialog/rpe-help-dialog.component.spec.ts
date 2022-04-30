import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpeHelpDialogComponent } from './rpe-help-dialog.component';

describe('RpeHelpDialogComponent', () => {
  let component: RpeHelpDialogComponent;
  let fixture: ComponentFixture<RpeHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RpeHelpDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RpeHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
