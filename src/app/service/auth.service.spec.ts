import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in with valid credentials', () => {
    const credentials = { username: 'testuser', password: 'testpass' };
    const mockResponse = { token: 'fake-jwt-token', userId: 1 };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should log out', () => {
    localStorage.setItem('jwt', 'fake-jwt-token');
    localStorage.setItem('userId', '1');

    service.logout();

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check if user is logged in', () => {
    localStorage.setItem('jwt', 'fake-jwt-token');
    expect(service.isLoggedIn()).toBeTrue();

    localStorage.removeItem('jwt');
    expect(service.isLoggedIn()).toBeFalse();
  });
});
