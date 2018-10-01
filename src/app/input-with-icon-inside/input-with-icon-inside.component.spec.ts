import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithIconInsideComponent } from './input-with-icon-inside.component';

describe('InputWithIconInsideComponent', () => {
  let component: InputWithIconInsideComponent;
  let fixture: ComponentFixture<InputWithIconInsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputWithIconInsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithIconInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
