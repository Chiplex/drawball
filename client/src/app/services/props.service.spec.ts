import { TestBed } from '@angular/core/testing';

import { PropsService } from './props.service';

describe('PropsService', () => {
  let service: PropsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
