import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService]
    });

    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve countries from the API', () => {
    const mockCountries = [
      { code: 'FI', name: 'Finland' },
      { code: 'SE', name: 'Sweden' },
      { code: 'NO', name: 'Norway' }
    ];

    service.getCountries().subscribe(countries => {
      expect(countries.length).toBe(3);
      expect(countries).toEqual(mockCountries);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/countries`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCountries); // Mock the response
  });

  it('should handle error response', () => {
    service.getCountries().subscribe(
      () => fail('should have failed with 500 error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/countries`);
    req.flush('Something went wrong', { status: 500, statusText: 'Server Error' });
  });
});
