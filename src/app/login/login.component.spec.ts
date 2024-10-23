import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should not submit the form if invalid', () => {
    component.onSubmit();
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should call AuthService.login and navigate on successful login', () => {
    const credentials = { username: 'testuser', password: 'testpass' };
    const mockResponse = { token: 'fake-jwt-token', userId: 1 };

    component.loginForm.setValue(credentials);
    authService.login.and.returnValue(of(mockResponse));

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(credentials);
    expect(router.navigate).toHaveBeenCalledWith(['/list']);
  });

  it('should handle login error', () => {
    const credentials = { username: 'testuser', password: 'testpass' };
    const errorResponse = { message: 'Invalid credentials' };

    component.loginForm.setValue(credentials);
    authService.login.and.returnValue(throwError(errorResponse));

    component.onSubmit();

    expect(notificationService.showError).toHaveBeenCalledWith('Login error! ' + errorResponse.message);
    expect(component.errorMessage).toEqual('Login failed. Please check your credentials.');
    expect(component.loading).toBeFalse();
  });
});
