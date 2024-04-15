/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EstadosService } from './estados.service';

describe('Service: Estados', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstadosService]
    });
  });

  it('should ...', inject([EstadosService], (service: EstadosService) => {
    expect(service).toBeTruthy();
  }));
});
