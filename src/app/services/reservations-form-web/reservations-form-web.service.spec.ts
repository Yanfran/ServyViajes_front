import { TestBed } from '@angular/core/testing';

import { ReservationsFormWebService } from './reservations-form-web.service';

describe('ReservationsFormWebService', () => {
  let service: ReservationsFormWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationsFormWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
