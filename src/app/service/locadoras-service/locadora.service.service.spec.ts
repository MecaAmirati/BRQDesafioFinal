import { TestBed } from '@angular/core/testing';

import { LocadoraServiceService } from './locadora.service.service';

describe('LocadoraServiceService', () => {
  let service: LocadoraServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocadoraServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
