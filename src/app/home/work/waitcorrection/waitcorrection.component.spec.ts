import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitcorrectionComponent } from './waitcorrection.component';

describe('WaitcorrectionComponent', () => {
  let component: WaitcorrectionComponent;
  let fixture: ComponentFixture<WaitcorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitcorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitcorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
