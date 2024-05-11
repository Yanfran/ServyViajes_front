import { TestBed } from '@angular/core/testing';

import { AvailableCategoriesService } from './available-categories.service';

describe('AvailableCategoriesService', () => {
  let service: AvailableCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvailableCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
