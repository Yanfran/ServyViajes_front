import { TestBed } from '@angular/core/testing';

import { ReportRoomingListService } from './report-rooming-list.service';

describe('ReportRoomingListService', () => {
  let service: ReportRoomingListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportRoomingListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
