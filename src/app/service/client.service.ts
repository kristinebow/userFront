import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  apiUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  saveClient(client: any, addedBy: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?addedBy=${addedBy}`, client);
  }

  updateClient(client: any, addedBy: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${client.id}?addedBy=${addedBy}`, client);
  }

  getClientsByUserId(addedByUserId: string | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${addedByUserId}`);
  }
}
