import { TestBed, inject } from '@angular/core/testing';

import { EsriGeocodeService } from './esri-geocode.service';

describe('EsriGeocodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EsriGeocodeService]
    });
  });

  it('should be created', inject([EsriGeocodeService], (service: EsriGeocodeService) => {
    expect(service).toBeTruthy();
  }));
});
