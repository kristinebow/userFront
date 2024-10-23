import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientListComponent } from './client-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../service/client.service';
import { NotificationService } from '../service/notification.service';
import { AuthService } from '../service/auth.service';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({ selector: 'app-add-new-client-dialog', template: '' })
class MockAddNewClientDialogComponent {}

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let clientService: jasmine.SpyObj<ClientService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const clientServiceMock = jasmine.createSpyObj('ClientService', ['getClientsByUserId']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']); // Add methods as needed

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ClientListComponent],
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: AuthService, useValue: authServiceMock }, // Provide the mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    clientService = TestBed.inject(ClientService) as jasmine.SpyObj<ClientService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>; // Inject the auth service mock
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on initialization', () => {
    const mockClients = [{ id: 1, name: 'Client 1', email: 'client1@example.com', phone: '123456789' }];
    spyOn(localStorage, 'getItem').and.returnValue('1'); // Simulate logged-in user ID
    clientService.getClientsByUserId.and.returnValue(of(mockClients));

    component.ngOnInit();

    expect(clientService.getClientsByUserId).toHaveBeenCalledWith('1');
    expect(component.clients).toEqual(mockClients);
  });

  it('should handle error when loading clients', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1'); // Simulate logged-in user ID
    clientService.getClientsByUserId.and.returnValue(throwError('Error fetching clients'));

    component.ngOnInit();

    expect(notificationService.showError).toHaveBeenCalledWith('Error fetching clients');
  });

  it('should open the add/edit client dialog', () => {
    const dialogRefMock = {
      afterClosed: () => of({ id: 1, name: 'Client 1', email: 'client1@example.com', phone: '123456789' })
    } as MatDialogRef<MockAddNewClientDialogComponent>;

    dialog.open.and.returnValue(dialogRefMock);

    component.openAddEditClientDialog();

    expect(dialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      width: '400px',
      data: undefined,
      disableClose: true
    });

    // Simulate dialog close and subscribe to the observable
    dialogRefMock.afterClosed().subscribe(result => {
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Client successfully added');
      expect(component.clients.length).toBe(1); // Assuming one client was added
    });
  });
});
