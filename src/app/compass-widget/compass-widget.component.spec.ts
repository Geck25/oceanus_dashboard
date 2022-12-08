import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompassWidgetComponent } from './compass-widget.component';

describe('CompassWidgetComponent', () => {
  let component: CompassWidgetComponent;
  let fixture: ComponentFixture<CompassWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompassWidgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompassWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
