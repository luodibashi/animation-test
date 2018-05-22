import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachertagComponent } from './teachertag.component';

describe('TeachertagComponent', () => {
  let component: TeachertagComponent;
  let fixture: ComponentFixture<TeachertagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachertagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachertagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
