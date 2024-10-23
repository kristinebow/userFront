import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewClientDialogComponent } from './add-new-client-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../service/notification.service';
import { CountryService } from '../service/country.service';
import { ClientService } from '../service/client.service';
import { of, throwError } from 'rxjs';

describe('AddNewClientDialogComponent', () => {
  let component: AddNewClientDialogComponent;
  let fixture: ComponentFixture<AddNewClientDialogComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let countryService: jasmine.SpyObj<CountryService>;
  let clientService: jasmine.SpyObj<ClientService>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<AddNewClientDialogComponent>>;

  beforeEach(() => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    notificationService = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    countryService = jasmine.createSpyObj('CountryService', ['getCountries']);
    clientService = jasmine.createSpyObj('ClientService', ['saveClient', 'updateClient']);

    TestBed.configureTestingModule({
      imports: [AddNewClientDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: NotificationService, useValue: notificationService },
        { provide: CountryService, useValue: countryService },
        { provide: ClientService, useValue: clientService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewClientDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries successfully', () => {
    const mockCountries = [{ name: 'Country 1' }, { name: 'Country 2' }];
    countryService.getCountries.and.returnValue(of(mockCountries));

    component.loadCountries();

    expect(component.countries).toEqual(mockCountries);
    expect(notificationService.showError).not.toHaveBeenCalled();
  });

  it('should close the dialog with correct client data on successful submit', () => {
    const addedById = '1'; // Mock the user ID from localStorage
    localStorage.setItem('userId', addedById);

    const mockClientData = {
      id: null,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: '123 Street',
      country: 'FI',
      addedById: addedById // Include addedById in the submitted data
    };

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.username = 'johndoe';
    component.email = 'john@example.com';
    component.address = '123 Street';
    component.country = 'FI';

    clientService.saveClient.and.returnValue(of(mockClientData));

    component.onSubmit();

    expect(clientService.saveClient).toHaveBeenCalledWith(mockClientData, addedById);
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockClientData); // Expect the mockClientData
  });

  it('should show error message on submit failure', () => {
    clientService.saveClient.and.returnValue(throwError('Error saving client'));

    component.onSubmit();

    expect(notificationService.showError).toHaveBeenCalledWith('Error saving client');
  });
});
