import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success notification', () => {
    const message = 'Operation was successful!';
    service.showSuccess(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Sulge', {
      duration: 10000,
      panelClass: ['success-snackbar']
    });
  });

  it('should show error notification', () => {
    const message = 'An error occurred!';
    service.showError(message);

    expect(snackBarSpy.open).toHaveBeenCalledWith(message, 'Sulge', {
      duration: 10000,
      panelClass: ['error-snackbar']
    });
  });
});
