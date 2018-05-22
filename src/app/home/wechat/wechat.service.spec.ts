import { TestBed, inject } from '@angular/core/testing';

import { WechatService } from './wechat.service';

describe('WechatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WechatService]
    });
  });

  it('should be created', inject([WechatService], (service: WechatService) => {
    expect(service).toBeTruthy();
  }));
});
