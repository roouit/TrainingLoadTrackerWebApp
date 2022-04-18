import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteAccountDialogComponent } from './confirm-delete-dialog.component';

describe('ConfirmDeleteDialogComponent', () => {
  let component: ConfirmDeleteAccountDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDeleteAccountDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeleteAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
