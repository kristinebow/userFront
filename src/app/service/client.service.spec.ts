import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a client', () => {
    const client = { firstName: 'John', lastName: 'Doe' };
    const addedBy = '1';
    const mockResponse = { id: 1, ...client };

    service.saveClient(client, addedBy).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}?addedBy=${addedBy}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a client', () => {
    const client = { id: 1, firstName: 'Jane', lastName: 'Doe' };
    const addedBy = '1';
    const mockResponse = { ...client };

    service.updateClient(client, addedBy).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/edit/${client.id}?addedBy=${addedBy}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should get clients by user ID', () => {
    const addedByUserId = '1';
    const mockClients = [
      { id: 1, firstName: 'John', lastName: 'Doe' },
      { id: 2, firstName: 'Jane', lastName: 'Doe' }
    ];

    service.getClientsByUserId(addedByUserId).subscribe(clients => {
      expect(clients.length).toBe(2);
      expect(clients).toEqual(mockClients);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/list/${addedByUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });
});
