import { TestBed } from '@angular/core/testing';

import { DronePositionService } from './drone-position.service';

describe('DronePositionService', () => {
  let service: DronePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DronePositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
