import { TestBed } from '@angular/core/testing';

import { WizardsFormService } from './wizards-form.service';

describe('WizardsFormService', () => {
  let service: WizardsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WizardsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
