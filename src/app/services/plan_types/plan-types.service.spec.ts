import { TestBed } from '@angular/core/testing';

import { PlanTypesService } from './plan-types.service';

describe('PlanTypesService', () => {
  let service: PlanTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
