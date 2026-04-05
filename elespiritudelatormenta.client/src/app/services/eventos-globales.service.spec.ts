import { TestBed } from '@angular/core/testing';

import { EventosGlobalesService } from './eventos-globales.service';

describe('EventosGlobalesService', () => {
  let service: EventosGlobalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosGlobalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
