import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimWeatherComponent } from './anim-weather.component';

describe('AnimWeatherComponent', () => {
  let component: AnimWeatherComponent;
  let fixture: ComponentFixture<AnimWeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimWeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
