import { TestBed } from '@angular/core/testing';

import { ReservaServiceService } from './reserva.service.service';

describe('ReservaServiceService', () => {
  let service: ReservaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
