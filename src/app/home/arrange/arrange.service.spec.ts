import { TestBed, inject } from '@angular/core/testing';

import { ArrangeService } from './arrange.service';

describe('ArrangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArrangeService]
    });
  });

  it('should be created', inject([ArrangeService], (service: ArrangeService) => {
    expect(service).toBeTruthy();
  }));
});
