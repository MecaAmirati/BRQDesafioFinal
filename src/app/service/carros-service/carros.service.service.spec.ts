import { TestBed } from '@angular/core/testing';

import { CarrosService } from './carros.service.service';

describe('CarrosServiceService', () => {
  let service: CarrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
