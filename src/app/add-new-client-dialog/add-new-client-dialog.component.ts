import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {ClientService} from '../service/client.service';
import {CountryService} from '../service/country.service';
import {NotificationService} from '../service/notification.service';

@Component({
  selector: 'app-add-new-client-dialog',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    FormsModule,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatError,
    NgForOf,
    NgIf
  ],
  templateUrl: './add-new-client-dialog.component.html',
  styleUrl: './add-new-client-dialog.component.css'
})
export class AddNewClientDialogComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  address: string = '';
  email: string = '';
  country: string = '';

  countries: any[] = [];

  isEditMode: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddNewClientDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private clientService: ClientService,
              private countryService: CountryService, private notificationService: NotificationService) {
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe((data: any[]) => {
      this.countries = data;
    });
  }

  onSubmit() {
    const addedById = localStorage.getItem('userId');
    const clientData = {
      id: this.isEditMode ? this.data.id : null,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      email: this.email,
      address: this.address,
      country: this.country,
      addedById: addedById
    };

    if (addedById !== null) {
      const saveOrUpdate = this.isEditMode
        ? this.clientService.updateClient(clientData, addedById)
        : this.clientService.saveClient(clientData, addedById);

      saveOrUpdate.subscribe(
        (response: any) => {
          console.log(this.isEditMode ? 'Client updated successfully' : 'Client saved successfully', response);
          this.dialogRef.close(clientData);
        },
        (error: any) => {
          console.error(this.isEditMode ? 'Error updating client' : 'Error saving client', error);
          this.notificationService.showError(this.isEditMode ? 'Error updating client' : 'Error saving client');
        }
      );
    } else {
      this.notificationService.showError('Could not find logged in user data');
      console.error('Could not find logged in user data');
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.loadCountries();
    if (this.data) {
      this.isEditMode = true;
      this.firstName = this.data.firstName;
      this.lastName = this.data.lastName;
      this.username = this.data.username;
      this.email = this.data.email;
      this.address = this.data.address;
      this.country = this.data.country;
    }
  }
}
