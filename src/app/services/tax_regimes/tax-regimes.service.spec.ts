import { TestBed } from '@angular/core/testing';

import { TaxRegimesService } from './tax-regimes.service';

describe('TaxRegimesService', () => {
  let service: TaxRegimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaxRegimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
