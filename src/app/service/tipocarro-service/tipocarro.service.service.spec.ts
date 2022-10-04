import { TestBed } from '@angular/core/testing';

import { TipocarroServiceService } from './tipocarro.service.service';

describe('TipocarroServiceService', () => {
  let service: TipocarroServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipocarroServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
