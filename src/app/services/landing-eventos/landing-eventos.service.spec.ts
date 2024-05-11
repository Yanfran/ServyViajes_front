import { TestBed } from '@angular/core/testing';

import { LandingEventosService } from './landing-eventos.service';

describe('LandingEventosService', () => {
  let service: LandingEventosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingEventosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
