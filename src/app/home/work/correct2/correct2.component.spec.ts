import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Correct2Component } from './correct2.component';

describe('Correct2Component', () => {
  let component: Correct2Component;
  let fixture: ComponentFixture<Correct2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Correct2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Correct2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
