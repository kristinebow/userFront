import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {NgForOf} from '@angular/common';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {AddNewClientDialogComponent} from '../add-new-client-dialog/add-new-client-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ClientService} from '../service/client.service';
import {NotificationService} from '../service/notification.service';
import {AuthService} from '../service/auth.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    NgForOf,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatTable,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatButton
  ],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})

export class ClientListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'actions'];

  clients: any[] = [];

  constructor(public dialog: MatDialog, private clientService: ClientService,
              private notificationService: NotificationService, protected authService: AuthService) {
  }

  loadClients(): void {
    const addedByUserId = localStorage.getItem('userId')
    if (addedByUserId !== null) {
      this.clientService.getClientsByUserId(addedByUserId).subscribe(
        (response) => {
          this.clients = response;
        },
        (error) => {
          console.error('Error fetching clients', error);
          this.notificationService.showError('Error fetching clients')
        }
      );
    } else {
      console.error('Could not get logged in user info!');
      this.notificationService.showError('Could not get logged in user info!')
    }
  }

  openAddEditClientDialog(client?: any): void {
    const dialogRef = this.dialog.open(AddNewClientDialogComponent, {
      width: '400px',
      data: client,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clients.push(result);
        this.loadClients();
        this.notificationService.showSuccess(client ? 'Client successfully updated' : 'Client successfully added')
      }
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }
}
