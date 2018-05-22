import { TestBed, inject } from '@angular/core/testing';

import { TeachertagService } from './teachertag.service';

describe('TeachertagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeachertagService]
    });
  });

  it('should be created', inject([TeachertagService], (service: TeachertagService) => {
    expect(service).toBeTruthy();
  }));
});
