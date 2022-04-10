import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCalculationsComponent } from './update-calculations.component';

describe('UpdateCalculationsComponent', () => {
  let component: UpdateCalculationsComponent;
  let fixture: ComponentFixture<UpdateCalculationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCalculationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCalculationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
