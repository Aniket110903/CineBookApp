import { TestBed } from '@angular/core/testing';

import { ViewShowTimingService } from './view-show-timing.service';

describe('ViewShowTimingService', () => {
  let service: ViewShowTimingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewShowTimingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
