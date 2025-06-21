import { TestBed } from '@angular/core/testing';

import { NotificationServService } from './notification-serv.service';

describe('NotificationServService', () => {
  let service: NotificationServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
