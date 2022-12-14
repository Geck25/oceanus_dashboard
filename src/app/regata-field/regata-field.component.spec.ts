import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegataFieldComponent } from './regata-field.component';

describe('RegataFieldComponent', () => {
  let component: RegataFieldComponent;
  let fixture: ComponentFixture<RegataFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegataFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegataFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
