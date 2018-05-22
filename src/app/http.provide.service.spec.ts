import { TestBed, inject } from '@angular/core/testing';

import { HttpProvideService } from './http.provide.service';

describe('HttpProvideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpProvideService]
    });
  });

  it('should be created', inject([HttpProvideService], (service: HttpProvideService) => {
    expect(service).toBeTruthy();
  }));
});
