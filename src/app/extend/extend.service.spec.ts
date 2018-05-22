import { TestBed, inject } from '@angular/core/testing';

import { ExtendService } from './extend.service';

describe('ExtendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtendService]
    });
  });

  it('should be created', inject([ExtendService], (service: ExtendService) => {
    expect(service).toBeTruthy();
  }));
});
