import { TestBed } from '@angular/core/testing';

import { LatlongFetchService } from './latlong-fetch.service';

describe('LatlongFetchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LatlongFetchService = TestBed.get(LatlongFetchService);
    expect(service).toBeTruthy();
  });
});
