/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PerfisService } from './perfis.service';

describe('Service: Perfis', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PerfisService]
    });
  });

  it('should ...', inject([PerfisService], (service: PerfisService) => {
    expect(service).toBeTruthy();
  }));
});
