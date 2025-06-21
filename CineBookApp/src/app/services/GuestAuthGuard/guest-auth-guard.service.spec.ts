import { TestBed } from '@angular/core/testing';

import { GuestAuthGuardService } from './guest-auth-guard.service';

describe('GuestAuthGuardService', () => {
  let service: GuestAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
