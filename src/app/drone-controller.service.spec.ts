import { TestBed } from '@angular/core/testing';

import { DroneControllerService } from './drone-controller.service';

describe('DroneControllerService', () => {
  let service: DroneControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DroneControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
