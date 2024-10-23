import { Routes } from '@angular/router';
import {ClientListComponent} from './client-list/client-list.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  { path: 'list', component: ClientListComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' }];
