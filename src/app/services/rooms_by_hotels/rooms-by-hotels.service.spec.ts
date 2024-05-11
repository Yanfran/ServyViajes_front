import { TestBed } from '@angular/core/testing';

import { RoomsByHotelsService } from './rooms-by-hotels.service';

describe('RoomsByHotelsService', () => {
  let service: RoomsByHotelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomsByHotelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
