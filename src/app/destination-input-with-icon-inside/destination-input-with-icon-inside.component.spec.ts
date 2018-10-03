import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationInputWithIconInsideComponent } from './destination-input-with-icon-inside.component';

describe('InputWithIconInsideComponent', () => {
  let component: DestinationInputWithIconInsideComponent;
  let fixture: ComponentFixture<DestinationInputWithIconInsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationInputWithIconInsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationInputWithIconInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
